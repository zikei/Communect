package com.example.communect.domain.service

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns

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

    /** グループユーザ追加 */
    fun addGroupUser(user: GroupUserIns): GroupUser
}