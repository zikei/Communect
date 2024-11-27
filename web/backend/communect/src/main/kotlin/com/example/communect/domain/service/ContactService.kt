package com.example.communect.domain.service

import com.example.communect.domain.model.Contact
import com.example.communect.domain.model.Reaction

/** 連絡処理インターフェース */
interface ContactService {
    /** グループ連絡一覧取得 */
    fun getContactsByGroupId(groupId: String, lastContactId: String?): List<Contact>
    /** 連絡取得 */
    fun getContact(contactId: String): Contact?
    /** リアクション取得 */
    fun getReactions(contactId: String): List<Reaction>
}