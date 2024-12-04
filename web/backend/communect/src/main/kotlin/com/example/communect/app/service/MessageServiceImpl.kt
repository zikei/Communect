package com.example.communect.app.service

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.service.MessageService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

/** メッセージ処理実装クラス */
@Service
class MessageServiceImpl(
    @Value("\${messageRowCount}") private val messageLimit: Int
): MessageService {
    /**
     *  メッセージ取得
     *  @param talkId 検索対象トークID
     *  @param lastMessageId 取得済み最古メッセージID
     *  @return トーク
     */
    override fun getMessages(talkId: String, lastMessageId: String?): List<Message>? {
        val message = lastMessageId?.let {id -> MockTestData.messageList.find { it.messageId == lastMessageId } }
        val messages = MockTestData.messageList.filter {
            it.talkId == talkId && ( message == null || it.createTime.isBefore(message.createTime) )
        }.sortedBy { it.createTime }
        return messages.take(messageLimit).sortedByDescending { it.createTime }
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
        return MockTestData.messageList[index]
    }
}