package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** メッセージ処理インターフェース */
interface MessageService {
    /** メッセージ取得 */
    fun getMessages(talkId: String, lastMessageId: String?): List<Message>?

    /** メッセージ送信 */
    fun postMessage(message: MessageIns): Message

    /** メッセージ更新 */
    fun updMessage(message: MessageUpd): Message
}