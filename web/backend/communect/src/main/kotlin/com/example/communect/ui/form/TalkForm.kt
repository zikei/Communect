package com.example.communect.ui.form

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.Talk
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

/** トークルームリスト返却 */
data class TalksResponse(val talks: List<TalkInfo>)

/** トークルーム返却 */
data class TalkResponse(val talk: TalkInfo)

/** メッセージリスト返却 */
data class MessagesResponse(val messages: List<MessageInfo>?)

/** トークルーム情報 */
data class TalkInfo(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String
){
    constructor(talk: Talk): this(
        talk.talkId,
        talk.talkName
    )
}

/** メッセージ情報 */
data class MessageInfo(
    /** メッセージID */
    val messageId: String,
    /** メッセージ */
    val message: String,
    /** メッセージ作成日時 */
    val createTime: LocalDateTime,
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String
){
    constructor(message: Message): this(
        message.messageId,
        message.message,
        message.createTime,
        message.userId,
        message.userName,
        message.nickName
    )
}

/** グループトーク作成リクエスト */
data class AddGroupTalkRequest(
    /** トーク名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val talkName: String
)

/** 個人グループ作成リクエスト */
data class AddIndividualTalkRequest(
    /** トーク名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val talkName: String,
    /** ユーザID */
    val userId: String
)