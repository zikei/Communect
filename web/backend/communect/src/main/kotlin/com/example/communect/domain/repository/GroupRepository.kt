package com.example.communect.domain.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns

/** グループリポジトリ */
interface GroupRepository {
    /** ユーザIDによる所属グループリストの取得 */
    fun findGroupByUserId(userId: String): List<Group>

    /** グループIDによるグループの取得 */
    fun findGroupByGroupId(groupId: String): Group?

    /** グループIDによるグループユーザの取得 */
    fun findGroupUsersByGroupId(groupId: String): List<GroupUser>

    /** グループID, ユーザIDによるグループユーザの取得 */
    fun findGroupUserByGroupIdAndUserId(groupId: String, userId: String): GroupUser?

    /** グループユーザIDによるグループユーザの取得 */
    fun findGroupUserByGroupUserId(groupUserId: String): GroupUser?

    /** グループ追加 */
    fun insertGroup(group: GroupIns): Group?

    /** グループユーザ追加 */
    fun insertGroupUser(user: GroupUserIns): GroupUser?
}