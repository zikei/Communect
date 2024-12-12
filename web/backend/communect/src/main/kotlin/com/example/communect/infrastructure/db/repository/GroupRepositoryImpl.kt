package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.repository.GroupRepository
import com.example.communect.infrastructure.db.mapper.NoticeGroupMapper
import com.example.communect.infrastructure.db.mapper.insert
import com.example.communect.infrastructure.db.mapper.select
import com.example.communect.infrastructure.db.mapper.selectOne
import org.springframework.stereotype.Repository
import java.util.UUID
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport as GroupSql
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroupSql
import com.example.communect.infrastructure.db.record.NoticeGroup as GroupRecord


/** グループリポジトリ実装クラス */
@Repository
class GroupRepositoryImpl(
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
        }.map { toModel(it) }
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
        }?.let { toModel(it) }
    }

    /**
     * グループ追加
     * @param group 追加グループ
     * @return 追加グループ
     */
    override fun insertGroup(group: GroupIns): Group? {
        val record = toRecord(group)
        groupMapper.insert(record)
        return toModel(record)
    }


    /** レコードのグループモデルへの変換 */
    private fun toModel(record: GroupRecord): Group{
        return Group(
            record.noticegroupid!!,
            record.grouptitle!!,
            record.aboveid!!
        )
    }

    /** グループモデルからレコードの変換 */
    private fun toRecord(model: GroupIns): GroupRecord{
        return GroupRecord(
            UUID.randomUUID().toString(),
            model.aboveId,
            model.groupName
        )
    }
}