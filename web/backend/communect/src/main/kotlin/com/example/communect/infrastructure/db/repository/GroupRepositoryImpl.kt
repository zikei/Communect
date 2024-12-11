package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.repository.GroupRepository
import com.example.communect.infrastructure.db.mapper.*
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as UserSql
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroupSql
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport as GroupSql
import com.example.communect.infrastructure.db.record.NoticeGroup as GroupRecord


/** グループリポジトリ実装クラス */
@Repository
class GroupRepositoryImpl(
    private val userMapper: UserMapper,
    private val userGroupMapper: UserGroupMapper,
    private val groupMapper: NoticeGroupMapper
) : GroupRepository {
    /**
     * ユーザIDによる所属グループリストの取得
     * @param userId ユーザID
     * @return 所属グループリスト
     */
    override fun findByUserId(userId: String): List<Group> {
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
    override fun findByGroupId(groupId: String): Group? {
        return groupMapper.selectOne {
            where {
                UserGroupSql.noticegroupid isEqualTo groupId
            }
        }?.let { toModelForGroup(it) }
    }

    private fun toModelForGroup(record: GroupRecord): Group{
        return Group(
            record.noticegroupid!!,
            record.grouptitle!!,
            record.aboveid!!
        )
    }
}