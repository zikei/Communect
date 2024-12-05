package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** 連絡処理インターフェース */
interface ContactService {
    /** グループ連絡一覧取得 */
    fun getContactsByGroupId(groupId: String, lastContactId: String?): List<Contact>?
    /** 連絡取得 */
    fun getContact(contactId: String): Contact?
    /** リアクション取得 */
    fun getReactions(contactId: String): List<Reaction>
    /** 連絡投稿 */
    fun addContact(contact: ContactIns): Contact
    /** 連絡更新 */
    fun updContact(contact: ContactUpd): Contact
    /** 連絡削除 */
    fun deleteContact(contactId: String)
    /** リアクション */
    fun addReaction(reaction: ReactionIns)
}