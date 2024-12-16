package com.example.communect.domain.repository

import com.example.communect.domain.model.*

/** 連絡リポジトリ */
interface ContactRepository {
    /** グループIDによる連絡取得 */
    fun findByContactId(contactId: String): Contact?

    /** グループIDによる連絡取得 */
    fun findByGroupId(groupId: String, lastContactId: String? = null): List<Contact>

    /** 連絡追加 */
    fun insertContact(contact: ContactIns): Contact?

    /** 選択肢追加 */
    fun insertChoices(choices: List<ChoiceIns>): List<Choice>

    /** 連絡更新 */
    fun updateContact(contact: ContactUpd)

    /** 連絡削除 */
    fun deleteByContactId(contactId: String)

    /** 連絡IDによる選択肢の削除 */
    fun deleteChoicesByContactId(contactId: String)
}