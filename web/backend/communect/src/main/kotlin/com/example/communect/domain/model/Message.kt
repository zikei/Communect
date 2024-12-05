package com.example.communect.domain.model

import java.time.LocalDateTime

/** トークメッセージエンティティ */
data class Message(
    /** メッセージID */
    val messageId: String,
    /** メッセージ */
    val message: String,
    /** メッセージ作成日時 */
    val createTime: LocalDateTime,
    /** トークID */
    val talkId: String,
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String
)

/** 追加用トークメッセージエンティティ */
data class MessageIns(
    /** メッセージ */
    val message: String,
    /** トークID */
    val talkId: String,
    /** ユーザID */
    val userId: String
)

/** 更新用トークメッセージエンティティ */
data class MessageUpd(
    /** メッセージID */
    val messageId: String,
    /** メッセージ */
    val message: String?
)