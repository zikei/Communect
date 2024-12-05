package com.example.communect.domain.model

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import java.time.LocalDateTime

/** 連絡エンティティ */
data class Contact(
    /** 連絡ID */
    val contactId: String,
    /** グループID */
    val groupId: String,
    /** グループ名 */
    val groupName: String,
    /** メッセージ */
    val message: String,
    /** 連絡種別 */
    val contactType: ContactType,
    /** 重要度 */
    val importance: Importance,
    /** 作成日時 */
    val createTime: LocalDateTime,
    /** 選択肢リスト */
    val choices: List<Choice>?
)

/** 追加用連絡エンティティ */
data class ContactIns(
    /** グループID */
    val groupId: String,
    /** メッセージ */
    val message: String,
    /** 連絡種別 */
    val contactType: ContactType,
    /** 重要度 */
    val importance: Importance,
    /** 選択肢 */
    val choices: List<String>?
)

/** 更新用連絡エンティティ */
data class ContactUpd(
    /** 連絡ID */
    val contactId: String,
    /** メッセージ */
    val message: String?,
    /** 連絡種別 */
    val contactType: ContactType?,
    /** 重要度 */
    val importance: Importance?,
    /** 選択肢 */
    val choices: List<String>?
)