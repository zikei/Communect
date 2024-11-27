package com.example.communect.ui.form

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Contact
import com.example.communect.domain.model.Reaction
import com.example.communect.ui.validator.NullOrNotBlank
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

/** 連絡リスト返却 */
data class ContactsResponse(val contacts: List<ContactInfo>)

/** 連絡詳細返却 */
data class ContactAndReactionsResponse(val contact: ContactInfo, val reactions: List<ReactionInfo>?)

/** 連絡作成返却 */
data class ContactResponse(val contact: ContactInfo)

/** 連絡情報情報 */
data class ContactInfo(
    /** 連絡ID */
    val contactId: String,
    /** メッセージ */
    val message: String,
    /** 連絡種別 */
    val contactType: ContactType,
    /** 重要度 */
    val importance: Importance,
    /** 作成日時 */
    val createTime: LocalDateTime,
    /** グループID */
    val groupId: String,
    /** グループ名 */
    val groupName: String,
    /** 選択肢リスト */
    val choices: List<ChoiceInfo>?
){
    constructor(contact: Contact): this(
        contact.contactId,
        contact.message,
        contact.contactType,
        contact.importance,
        contact.createTime,
        contact.groupId,
        contact.groupName,
        contact.choices?.map { ChoiceInfo(it) }
    )
}

/** 連絡情報 */
data class ChoiceInfo(
    /** 連絡ID */
    val contactId: String,
    /** 選択肢ID */
    val choiceId: String,
    /** 選択肢 */
    val choice: String,
){
    constructor(choice: Choice): this(
        choice.contactId,
        choice.choiceId,
        choice.choice
    )
}

/** リアクション情報 */
data class ReactionInfo(
    /** 連絡ID */
    val contactId: String,
    /** リアクションID */
    val reactionId: String,
    /** リアクション日時 */
    val reactionTime: LocalDateTime,
    /** 選択肢 */
    val choice: ChoiceInfo?,
    /** リアクションユーザId */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String
){
    constructor(reaction: Reaction): this(
        reaction.contactId,
        reaction.reactionId,
        reaction.reactionTime,
        reaction.choice?.let { ChoiceInfo(it) },
        reaction.userId,
        reaction.userName,
        reaction.userNickName
    )
}

/** 連絡投稿リクエスト */
data class ContactPostRequest(
    /** メッセージ */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 450)
    val message: String,
    /** 連絡種別 */
    val contactType: ContactType,
    /** 重要度 */
    val importance: Importance,
    /** グループID */
    val groupId: String,
    /** 選択肢リスト */
    val choices: List<String>? = null
)

/** 連絡更新リクエスト */
data class UpdContactRequest(
    /** メッセージ */
    @get:NullOrNotBlank
    @get:Size(max = 450)
    val message: String? = null,
    /** 連絡種別 */
    val contactType: ContactType? = null,
    /** 重要度 */
    val importance: Importance? = null,
    /** 選択肢リスト */
    val choices: List<String>? = null
)

/** リアクションリクエスト */
data class AddReactionRequest(
    /** 選択肢ID */
    val choiceId: String? = null
)