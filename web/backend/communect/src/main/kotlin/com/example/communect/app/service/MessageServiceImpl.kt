package com.example.communect.app.service

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.repository.MessageRepository
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.domain.service.MessageService
import com.example.communect.ui.form.MessageDeleteResponse
import com.example.communect.ui.form.MessageInfo
import com.example.communect.ui.form.MessageResponse
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ConcurrentHashMap

/** メッセージ処理実装クラス */
@Service
class MessageServiceImpl(
    @Autowired val messageRepository: MessageRepository,
    @Autowired val talkRepository: TalkRepository,
    @Autowired val emitterRepository: MessageSseEmitterRepository
): MessageService {
    /**
     *  メッセージ取得
     *  @param talkId 検索対象トークID
     *  @param lastMessageId 取得済み最古メッセージID
     *  @return トーク
     */
    override fun getMessages(talkId: String, lastMessageId: String?): List<Message>? {
        return messageRepository.findByTalkId(talkId, lastMessageId).takeIf { it.isNotEmpty() }
    }

    /**
     *  メッセージ投稿
     *  @param message 投稿メッセージ情報
     *  @return 投稿メッセージ情報
     */
    override fun postMessage(message: MessageIns): Message {
        val insMessage = messageRepository.insertMessage(message) ?: throw BadRequestException()

        val messageUserIds = getMessageUserIds(insMessage.messageId)
        messageUserIds.forEach { id ->
            emitterRepository.send(id, "post", MessageResponse(MessageInfo(insMessage)))
        }

        return insMessage
    }

    /**
     *  メッセージ更新
     *  @param message 更新メッセージ情報
     *  @return 更新メッセージ情報
     */
    override fun updMessage(message: MessageUpd, loginUserId: String): Message {
        val oldMessage = messageRepository.findByMessageId(message.messageId) ?: throw BadRequestException()
        if(oldMessage.userId != loginUserId) throw BadRequestException()

        messageRepository.updateMessage(message)
        val updMessage = messageRepository.findByMessageId(message.messageId) ?: throw BadRequestException()

        val messageUserIds = getMessageUserIds(message.messageId)
        messageUserIds.forEach { id ->
            emitterRepository.send(id, "update", MessageResponse(MessageInfo(updMessage)))
        }
        return updMessage
    }

    /**
     *  メッセージ削除
     *  @param messageId 削除対象メッセージID
     */
    override fun deleteMessage(messageId: String, loginUserId: String) {
        val oldMessage = messageRepository.findByMessageId(messageId) ?: throw BadRequestException()
        if(oldMessage.userId != loginUserId) throw BadRequestException()

        messageRepository.deleteByMessageId(messageId)

        val messageUserIds = getMessageUserIds(messageId)
        messageUserIds.forEach { id ->
            emitterRepository.send(id, "delete", MessageDeleteResponse(messageId))
        }
    }

    /**
     * SSE登録
     * @param userId SSE登録ユーザID
     */
    override fun addSse(userId: String): SseEmitter {
        return emitterRepository.addEmitter(userId)
    }

    /** メッセージのトークに所属するユーザIDリストを取得 */
    private fun getMessageUserIds(messageId: String): List<String>{
        val message = messageRepository.findByMessageId(messageId) ?: return mutableListOf()
        return talkRepository.findUserByTalkId(message.talkId).map { it.userId }
    }
}

@Component
class MessageSseEmitterRepository(
    @Value("\${sseTimeOutMinutes}") private val sseTimeOutMinutes: Long
) {
    private val emitters = ConcurrentHashMap<String, MutableSet<SseEmitter>>()

    fun addEmitter(userId: String): SseEmitter {
        val emitter = SseEmitter(sseTimeOutMinutes * 60 * 1000)
        emitter.onCompletion {
            removeEmitter(userId, emitter)
        }
        emitter.onTimeout{
            removeEmitter(userId, emitter)
        }

        synchronized(this) {
            emitters.computeIfAbsent(userId) { mutableSetOf() }.add(emitter)
        }

        emitter.send(
            SseEmitter.event()
                .name("connection")
                .data("message: Connection established successfully")
        )

        return emitter
    }

    fun removeEmitter(userId: String, emitter: SseEmitter) {
        synchronized(this) {
            emitters[userId]?.let { emitterSet ->
                emitterSet.remove(emitter)
                if (emitterSet.isEmpty()) {
                    emitters.remove(userId)
                }
            }
        }

        try {
            emitter.send(
                SseEmitter.event()
                    .name("disconnect")
                    .data("contact: Connection closed")
            )
        } catch (_: Exception) { }
    }

    fun send(userId: String, name: String, data: Any){
        val userEmitters = synchronized(this) { emitters[userId]?.toSet() } ?: return

        userEmitters.forEach {
            try {
                it.send(
                    SseEmitter.event()
                        .name(name)
                        .data(data)
                )
            } catch (e: Exception) {
                synchronized(this) {
                    removeEmitter(userId, it)
                }
            }
        }
    }
}