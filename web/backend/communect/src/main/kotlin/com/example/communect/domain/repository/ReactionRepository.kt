package com.example.communect.domain.repository

import com.example.communect.domain.model.Reaction

/** リアクションリポジトリ */
interface ReactionRepository {
    /** 連絡IDによるリアクション取得 */
    fun findByContactId(contactId: String):List<Reaction>

    /** 連絡IDによるリアクションの削除 */
    fun deleteByContactId(contactId: String)
}