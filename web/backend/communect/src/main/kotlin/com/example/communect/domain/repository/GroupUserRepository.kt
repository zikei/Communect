package com.example.communect.domain.repository

import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns
import com.example.communect.domain.model.GroupUserUpd

/** グループユーザリポジトリ */
interface GroupUserRepository {
    /** グループIDによるグループユーザの取得 */
    fun findByGroupId(groupId: String): List<GroupUser>

    /** グループID, ユーザIDによるグループユーザの取得 */
    fun findByGroupIdAndUserId(groupId: String, userId: String): GroupUser?

    /** グループユーザIDによるグループユーザの取得 */
    fun findByGroupUserId(groupUserId: String): GroupUser?

    /** グループユーザ追加 */
    fun insertGroupUser(user: GroupUserIns): GroupUser?

    /** グループユーザ更新 */
    fun updateGroupUser(user: GroupUserUpd)

    /** グループユーザ削除 */
    fun deleteGroupUser(groupUserId: String)
}