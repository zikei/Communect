package com.example.communect.domain.service

import com.example.communect.domain.model.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

/** メッセージ処理インターフェース */
interface MessageService {
    /** メッセージ取得 */
    fun getMessages(talkId: String, lastMessageId: String?): List<Message>?

    /** メッセージ送信 */
    fun postMessage(message: MessageIns): Message

    /** メッセージ更新 */
    fun updMessage(message: MessageUpd, loginUserId: String): Message

    /** メッセージ削除 */
    fun deleteMessage(messageId: String, loginUserId: String)

    /** SSE登録 */
    fun addSse(userId: String): SseEmitter
}