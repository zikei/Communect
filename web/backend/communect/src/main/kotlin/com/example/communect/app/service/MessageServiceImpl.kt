package com.example.communect.app.service

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.repository.MessageRepository
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
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.ConcurrentHashMap

/** メッセージ処理実装クラス */
@Service
class MessageServiceImpl(
    @Autowired val messageRepository: MessageRepository,
    @Autowired val emitterRepository: MessageSseEmitterRepository
): MessageService {
    /**
     *  メッセージ取得
     *  @param talkId 検索対象トークID
     *  @param lastMessageId 取得済み最古メッセージID
     *  @return トーク
     */
    override fun getMessages(talkId: String, lastMessageId: String?): List<Message>? {
        return messageRepository.findByTalkId(talkId, lastMessageId)
    }

    /**
     *  メッセージ投稿
     *  @param message 投稿メッセージ情報
     *  @return 投稿メッセージ情報
     */
    override fun postMessage(message: MessageIns): Message {
        val user = MockTestData.userList.find { it.userId == message.userId } ?: throw BadRequestException()
        val insMessage = Message(UUID.randomUUID().toString(), message.message, LocalDateTime.now(), message.talkId, user.userId, user.userName, user.nickName)

        MockTestData.messageList.add(insMessage)

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
    override fun updMessage(message: MessageUpd): Message {
        val index = MockTestData.messageList.indexOfFirst { it.messageId == message.messageId }
        if(index == -1) throw BadRequestException()

        val updMessage =
            Message(message.messageId, message.message ?: MockTestData.messageList[index].message, MockTestData.messageList[index].createTime,
                MockTestData.messageList[index].talkId, MockTestData.messageList[index].userId,
                MockTestData.messageList[index].userName, MockTestData.messageList[index].nickName)

        MockTestData.messageList[index] = updMessage

        val messageUserIds = getMessageUserIds(updMessage.messageId)
        messageUserIds.forEach { id ->
            emitterRepository.send(id, "update", MessageResponse(MessageInfo(updMessage)))
        }
        return MockTestData.messageList[index]
    }

    /**
     *  メッセージ削除
     *  @param messageId 削除対象メッセージID
     */
    override fun deleteMessage(messageId: String) {
        val messageUserIds = getMessageUserIds(messageId)

        MockTestData.messageList.removeAll { it.messageId == messageId }

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

    private fun getMessageUserIds(messageId: String): List<String>{
        val message = MockTestData.messageList.find { it.messageId == messageId } ?: return mutableListOf()
        val talk = MockTestData.talkList.find { it.talkId == message.talkId } ?: return mutableListOf()
        return when (talk.talkType) {
            TalkType.GROUP -> {
                val groupId = MockTestData.groupTalkList.find { it.talkId == talk.talkId }?.groupId ?: return mutableListOf()
                MockTestData.groupUserList.filter { it.groupId == groupId }.map { it.userId }
            }
            TalkType.INDIVIDUAL -> {
                MockTestData.individualTalkList.find { it.talkId == talk.talkId }?.users?.map { it.userId } ?: return mutableListOf()
            }
        }
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
        emitters[userId]?.forEach { emitter ->
            try {
                emitter.send(
                    SseEmitter.event()
                        .name(name)
                        .data(data)
                )
            }catch (e: Exception){
                removeEmitter(userId, emitter)
            }
        }
    }
}