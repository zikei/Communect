package com.example.communect.domain.repository

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd

/** メッセージリポジトリ */
interface MessageRepository {
    /**  メッセージIDによるメッセージ取得 */
    fun findByMessageId(messageId: String): Message?

    /** トークIDによるメッセージの取得 */
    fun findByTalkId(talkId: String, lastMessageId: String? = null): List<Message>

    /** メッセージ追加 */
    fun insertMessage(message: MessageIns): Message?

    /** メッセージ更新 */
    fun updateMessage(message: MessageUpd)
}