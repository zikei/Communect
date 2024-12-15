package com.example.communect.domain.repository

import com.example.communect.domain.model.Contact
import com.example.communect.domain.model.ContactIns

/** 連絡リポジトリ */
interface ContactRepository {
    /** グループIDによる連絡取得 */
    fun findByContactId(contactId: String): Contact?

    /** グループIDによる連絡取得 */
    fun findByGroupId(groupId: String, lastContactId: String? = null): List<Contact>

    /** 連絡追加 */
    fun insertContact(contact: ContactIns): Contact?
}