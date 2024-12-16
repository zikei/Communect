package com.example.communect.domain.repository

import com.example.communect.domain.model.Talk

/** トークリポジトリ */
interface TalkRepository {
    /** グループIDによるグループトーク一覧の取得 */
    fun findByGroupId(groupId: String): List<Talk>
}