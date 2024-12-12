package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** グループ処理インターフェース */
interface GroupService {
    /** グループ一覧取得 */
    fun getGroups(userId: String): List<Group>

    /** グループ取得 */
    fun getGroup(groupId: String): Group?

    /** グループユーザ一覧取得 */
    fun getGroupUsers(groupId: String): List<GroupUser>

    /** グループユーザ取得 */
    fun getGroupUser(groupId: String, userId: String): GroupUser?

    /** グループ作成 */
    fun createGroup(group: GroupIns, loginUserId: String, userIds: List<String>?): Pair<Group, List<GroupUser>>

    /** グループ更新 */
    fun updGroup(group: GroupUpd, loginUserId: String): Group

    /** グループ削除 */
    fun deleteGroup(groupId: String, loginUserId: String)

    /** グループユーザ追加 */
    fun addGroupUser(user: GroupUserIns, loginUserId: String): GroupUser

    /** グループユーザ更新 */
    fun updGroupUser(user: GroupUserUpd, loginUserId: String): GroupUser

    /** グループユーザ削除 */
    fun deleteGroupUser(groupUserId: String, loginUserId: String)
}