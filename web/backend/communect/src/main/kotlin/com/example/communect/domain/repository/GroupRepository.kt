package com.example.communect.domain.repository

import com.example.communect.domain.model.Group

/** グループリポジトリ */
interface GroupRepository {
    /** ユーザIDによる所属グループリストの取得 */
    fun findByUserId(userId: String): List<Group>

    /** グループIDによるグループの取得 */
    fun findByGroupId(groupId: String): Group?
}