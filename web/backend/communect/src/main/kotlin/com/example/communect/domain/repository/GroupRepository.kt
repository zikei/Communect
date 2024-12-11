package com.example.communect.domain.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUser

/** グループリポジトリ */
interface GroupRepository {
    /** ユーザIDによる所属グループリストの取得 */
    fun findByUserId(userId: String): List<Group>

    /** グループIDによるグループの取得 */
    fun findByGroupId(groupId: String): Group?

    /** グループIDによるグループユーザの取得 */
    fun findGroupUsersByGroupId(groupId: String): List<GroupUser>

    /** グループID, ユーザIDによるグループユーザの取得 */
    fun findGroupUser(groupId: String, userId: String): GroupUser?

    /** グループ追加 */
    fun insertGroup(group: GroupIns): Group
}