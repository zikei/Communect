package com.example.communect.domain.repository

import com.example.communect.domain.model.Contact

/** 連絡リポジトリ */
interface ContactRepository {
    /** グループIDによる連絡取得 */
    fun findByGroupId(groupId: String, lastContactId: String? = null): List<Contact>
}