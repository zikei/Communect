package com.example.communect.domain.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUpd

/** グループリポジトリ */
interface GroupRepository {
    /** ユーザIDによる所属グループリストの取得 */
    fun findByUserId(userId: String): List<Group>

    /** グループIDによるグループの取得 */
    fun findByGroupId(groupId: String): Group?

    /** グループ追加 */
    fun insertGroup(group: GroupIns): Group?

    /** グループ更新 */
    fun updateGroup(group: GroupUpd)

    /** グループ削除 */
    fun deleteByGroupId(groupId: String)
}