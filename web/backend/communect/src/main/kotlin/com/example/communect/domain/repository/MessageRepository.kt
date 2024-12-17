package com.example.communect.domain.repository

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns

/** メッセージリポジトリ */
interface MessageRepository {
    /** トークIDによるメッセージの取得 */
    fun findByTalkId(talkId: String, lastMessageId: String? = null): List<Message>

    /** メッセージ追加 */
    fun insertMessage(message: MessageIns): Message?
}