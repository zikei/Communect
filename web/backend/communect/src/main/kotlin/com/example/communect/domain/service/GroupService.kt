package com.example.communect.domain.service

import com.example.communect.domain.model.Group

/** グループ処理インターフェース */
interface GroupService {
    /** グループ一覧取得 */
    fun getGroups(userId: String): List<Group>
}