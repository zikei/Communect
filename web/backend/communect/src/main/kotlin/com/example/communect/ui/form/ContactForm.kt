package com.example.communect.ui.form

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Contact
import java.time.LocalDateTime

/** 連絡リスト返却 */
data class ContactsResponse(val contacts: List<ContactInfo>)

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

/** 連絡情報情報 */
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