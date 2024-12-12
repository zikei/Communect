package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns
import com.example.communect.domain.repository.GroupRepository
import com.example.communect.infrastructure.db.mapper.*
import com.example.communect.infrastructure.db.mapper.custom.CustomGroupUserMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupId
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupIdAndUserId
import com.example.communect.infrastructure.db.mapper.custom.selectByPrimaryKey
import com.example.communect.infrastructure.db.record.custom.CustomGroupUser
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroupSql
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport as GroupSql
import com.example.communect.infrastructure.db.record.NoticeGroup as GroupRecord
import com.example.communect.infrastructure.db.record.UserGroup as GroupUserRecord


/** グループリポジトリ実装クラス */
@Repository
class GroupRepositoryImpl(
    private val groupMapper: NoticeGroupMapper,
    private val customGroupUserMapper: CustomGroupUserMapper,
    private val groupUserMapper: UserGroupMapper
) : GroupRepository {
    /**
     * ユーザIDによる所属グループリストの取得
     * @param userId ユーザID
     * @return 所属グループリスト
     */
    override fun findGroupByUserId(userId: String): List<Group> {
        return groupMapper.select {
            leftJoin(UserGroupSql.userGroup, "ug"){
                on(GroupSql.noticegroupid) equalTo(UserGroupSql.noticegroupid)
            }
            where {
                UserGroupSql.userid isEqualTo userId
            }
        }.map { toModelForGroup(it) }
    }

    /**
     * グループIDによるグループの取得
     * @param groupId グループID
     * @return グループ
     */
    override fun findGroupByGroupId(groupId: String): Group? {
        return groupMapper.selectOne {
            where {
                UserGroupSql.noticegroupid isEqualTo groupId
            }
        }?.let { toModelForGroup(it) }
    }

    /**
     * グループIDによるグループユーザの取得
     * @param groupId グループID
     * @return グループユーザリスト
     */
    override fun findGroupUsersByGroupId(groupId: String): List<GroupUser> {
        return customGroupUserMapper.selectByGroupId(groupId).map { toModelForGroupUser(it) }
    }

    /**
     * グループIDによるグループユーザの取得
     * @param groupId グループID
     * @param userId ユーザID
     * @return グループユーザリスト
     */
    override fun findGroupUserByGroupIdAndUserId(groupId: String, userId: String): GroupUser? {
        return customGroupUserMapper.selectByGroupIdAndUserId(groupId, userId)?.let { toModelForGroupUser(it) }
    }

    /**
     * グループユーザIDによるグループユーザの取得
     * @param groupUserId グループユーザID
     * @return グループユーザリスト
     */
    override fun findGroupUserByGroupUserId(groupUserId: String): GroupUser? {
        return customGroupUserMapper.selectByPrimaryKey(groupUserId)?.let { toModelForGroupUser(it) }
    }

    /**
     * グループ追加
     * @param group 追加グループ
     * @return 追加グループ
     */
    override fun insertGroup(group: GroupIns): Group? {
        val record = toRecord(group)
        groupMapper.insert(record)
        return toModelForGroup(record)
    }

    /**
     * グループユーザ追加
     * @param user 追加グループユーザ
     * @return 追加グループユーザ
     */
    override fun insertGroupUser(user: GroupUserIns): GroupUser? {
        val record = toRecord(user)
        groupUserMapper.insert(record)
        return record.usergroupid?.let { findGroupUserByGroupUserId(it) }
    }


    /** レコードのグループモデルへの変換 */
    private fun toModelForGroup(record: GroupRecord): Group{
        return Group(
            record.noticegroupid!!,
            record.grouptitle!!,
            record.aboveid!!
        )
    }

    /** レコードのグループユーザモデルへの変換 */
    private fun toModelForGroupUser(record: CustomGroupUser): GroupUser{
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

    /** グループモデルからレコードの変換 */
    private fun toRecord(model: GroupIns): GroupRecord{
        return GroupRecord(
            null,
            model.aboveId,
            model.groupName
        )
    }

    /** グループユーザモデルからレコードの変換 */
    private fun toRecord(model: GroupUserIns): GroupUserRecord{
        return GroupUserRecord(
            null,
            model.groupId,
            model.userId,
            model.nickName,
            model.role,
            model.isSubGroupCreate,
            model.isAdmin
        )
    }
}