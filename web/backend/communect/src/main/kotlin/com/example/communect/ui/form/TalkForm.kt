package com.example.communect.ui.form

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.Talk
import com.example.communect.ui.validator.NullOrNotBlank
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

/** メッセージ返却 */
data class MessageResponse(val message: MessageInfo)

/** メッセージ削除返却 */
data class MessageDeleteResponse(val messageId: String)

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

/** 個人トーク作成リクエスト */
data class AddIndividualTalkRequest(
    /** トーク名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val talkName: String,
    /** ユーザID */
    val userId: String
)

/** トーク更新リクエスト */
data class UpdTalkRequest(
    /** トーク名 */
    @get:NullOrNotBlank
    @get:Size(max = 20)
    val talkName: String? = null
)

/** メッセージ送信リクエスト */
data class PostMessageRequest(
    /** メッセージ */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 450)
    val message: String
)

/** メッセージ送信リクエスト ウェブソケット */
data class WSPostMessageRequest(
    /** トークID */
    @get:NotBlank
    @get:NotEmpty
    val talkId: String,

    /** メッセージ */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 450)
    val message: String
)

/** メッセージ更新リクエスト */
data class UpdMessageRequest(
    /** メッセージ */
    @get:NullOrNotBlank
    @get:Size(max = 450)
    val message: String
)

/** メッセージ更新リクエスト ウェブソケット */
data class WSUpdMessageRequest(
    /** メッセージID */
    @get:NotBlank
    @get:NotEmpty
    val messageId: String,

    /** メッセージ */
    @get:NullOrNotBlank
    @get:Size(max = 450)
    val message: String
)

/** メッセージ削除リクエスト ウェブソケット */
data class WSDeleteMessageRequest(
    /** メッセージID */
    @get:NotBlank
    @get:NotEmpty
    val messageId: String
)