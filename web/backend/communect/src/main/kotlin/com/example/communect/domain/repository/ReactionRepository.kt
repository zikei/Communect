package com.example.communect.domain.repository

import com.example.communect.domain.model.Reaction
import com.example.communect.domain.model.ReactionIns

/** リアクションリポジトリ */
interface ReactionRepository {
    /** 連絡IDによるリアクション取得 */
    fun findByContactId(contactId: String):List<Reaction>

    /** リアクション追加 */
    fun insertReaction(reaction: ReactionIns)

    /** 連絡IDによるリアクションの削除 */
    fun deleteByContactId(contactId: String)
}