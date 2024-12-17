package com.example.communect.domain.repository

import com.example.communect.domain.model.Message

/** メッセージリポジトリ */
interface MessageRepository {
    /** トークIDによるメッセージの取得 */
    fun findByTalkId(talkId: String, lastMessageId: String? = null): List<Message>
}