package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns
import com.example.communect.domain.model.GroupUserUpd
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.infrastructure.db.mapper.*
import com.example.communect.infrastructure.db.mapper.custom.CustomGroupUserMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupId
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupIdAndUserId
import com.example.communect.infrastructure.db.mapper.custom.selectByPrimaryKey
import com.example.communect.infrastructure.db.record.custom.CustomGroupUser
import org.springframework.stereotype.Repository
import java.util.*
import com.example.communect.infrastructure.db.record.UserGroup as GroupUserRecord


/** グループリポジトリ実装クラス */
@Repository
class GroupUserRepositoryImpl(
    private val customGroupUserMapper: CustomGroupUserMapper,
    private val groupUserMapper: UserGroupMapper
) : GroupUserRepository {
    /**
     * グループIDによるグループユーザの取得
     * @param groupId グループID
     * @return グループユーザリスト
     */
    override fun findByGroupId(groupId: String): List<GroupUser> {
        return customGroupUserMapper.selectByGroupId(groupId).map { toModel(it) }
    }

    /**
     * グループIDによるグループユーザの取得
     * @param groupId グループID
     * @param userId ユーザID
     * @return グループユーザリスト
     */
    override fun findByGroupIdAndUserId(groupId: String, userId: String): GroupUser? {
        return customGroupUserMapper.selectByGroupIdAndUserId(groupId, userId)?.let { toModel(it) }
    }

    /**
     * グループユーザIDによるグループユーザの取得
     * @param groupUserId グループユーザID
     * @return グループユーザリスト
     */
    override fun findByGroupUserId(groupUserId: String): GroupUser? {
        return customGroupUserMapper.selectByPrimaryKey(groupUserId)?.let { toModel(it) }
    }

    /**
     * グループユーザ追加
     * @param user 追加グループユーザ
     * @return 追加グループユーザ
     */
    override fun insertGroupUser(user: GroupUserIns): GroupUser? {
        val record = toRecord(user)
        groupUserMapper.insert(record)
        return record.usergroupid?.let { findByGroupUserId(it) }
    }

    /**
     * グループユーザ更新
     * @param user 更新グループユーザ
     * @return 更新グループユーザ
     */
    override fun updateGroupUser(user: GroupUserUpd) {
        val record = toRecord(user)
        if(record.nickname == ""){
            record.nickname = null
            groupUserMapper.updateNicknameToNullByPrimaryKey(user.groupUserId)
        }
        groupUserMapper.updateByPrimaryKeySelective(record)
    }

    /**
     * グループユーザ削除
     * @param groupUserId 削除対象グループユーザID
     */
    override fun deleteGroupUser(groupUserId: String) {
        groupUserMapper.deleteByPrimaryKey(groupUserId)
    }


    /** レコードのグループユーザモデルへの変換 */
    private fun toModel(record: CustomGroupUser): GroupUser{
        return GroupUser(
            record.groupuserid!!,
            record.groupid!!,
            record.userid!!,
            record.username!!,
            if(record.groupnickname.isNullOrBlank()){
                record.nickname!!
            }else{
                record.groupnickname!!
            },
            record.role!!,
            record.isadmin!!,
            record.issubgroupcreate!!
        )
    }

    /** グループユーザモデルからレコードの変換 */
    private fun toRecord(model: GroupUserIns): GroupUserRecord{
        return GroupUserRecord(
            UUID.randomUUID().toString(),
            model.groupId,
            model.userId,
            model.nickName,
            model.role,
            model.isSubGroupCreate,
            model.isAdmin
        )
    }

    /** グループユーザモデルからレコードの変換 */
    private fun toRecord(model: GroupUserUpd): GroupUserRecord{
        return GroupUserRecord(
            model.groupUserId,
            null,
            null,
            model.nickName,
            model.role,
            model.isSubGroupCreate,
            model.isAdmin
        )
    }
}