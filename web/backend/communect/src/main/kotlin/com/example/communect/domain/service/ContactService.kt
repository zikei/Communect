package com.example.communect.domain.service

import com.example.communect.domain.model.Contact

/** 連絡処理インターフェース */
interface ContactService {
    /** グループ連絡一覧取得 */
    fun getContactsByGroupId(groupId: String, lastContactId: String?): List<Contact>
}