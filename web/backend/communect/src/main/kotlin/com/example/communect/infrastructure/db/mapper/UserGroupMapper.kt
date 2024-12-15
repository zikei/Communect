/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.groupadmin
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.nickname
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.noticegroupid
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.role
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.subgroupcreateauthority
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userGroup
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.usergroupid
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userid
import com.example.communect.infrastructure.db.record.UserGroup
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.EnumTypeHandler
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.*
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.*
import org.mybatis.dynamic.sql.util.mybatis3.CommonCountMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonDeleteMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonInsertMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonUpdateMapper

@Mapper
interface UserGroupMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<UserGroup>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="UserGroupResult", value = [
        Result(column="userGroupId", property="usergroupid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="noticeGroupId", property="noticegroupid", jdbcType=JdbcType.CHAR),
        Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
        Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
        Result(column="role", property="role", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
        Result(column="subGroupCreateAuthority", property="subgroupcreateauthority", jdbcType=JdbcType.BIT),
        Result(column="groupAdmin", property="groupadmin", jdbcType=JdbcType.BIT)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<UserGroup>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("UserGroupResult")
    fun selectOne(selectStatement: SelectStatementProvider): UserGroup?
}

fun UserGroupMapper.count(completer: CountCompleter) =
    countFrom(this::count, userGroup, completer)

fun UserGroupMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, userGroup, completer)

fun UserGroupMapper.deleteByPrimaryKey(usergroupid_: String) =
    delete {
        where { usergroupid isEqualTo usergroupid_ }
    }

fun UserGroupMapper.insert(row: UserGroup) =
    insert(this::insert, row, userGroup) {
        map(usergroupid) toProperty "usergroupid"
        map(noticegroupid) toProperty "noticegroupid"
        map(userid) toProperty "userid"
        map(nickname) toProperty "nickname"
        map(role) toProperty "role"
        map(subgroupcreateauthority) toProperty "subgroupcreateauthority"
        map(groupadmin) toProperty "groupadmin"
    }

fun UserGroupMapper.insertMultiple(records: Collection<UserGroup>) =
    insertMultiple(this::insertMultiple, records, userGroup) {
        map(usergroupid) toProperty "usergroupid"
        map(noticegroupid) toProperty "noticegroupid"
        map(userid) toProperty "userid"
        map(nickname) toProperty "nickname"
        map(role) toProperty "role"
        map(subgroupcreateauthority) toProperty "subgroupcreateauthority"
        map(groupadmin) toProperty "groupadmin"
    }

fun UserGroupMapper.insertMultiple(vararg records: UserGroup) =
    insertMultiple(records.toList())

fun UserGroupMapper.insertSelective(row: UserGroup) =
    insert(this::insert, row, userGroup) {
        map(usergroupid).toPropertyWhenPresent("usergroupid", row::usergroupid)
        map(noticegroupid).toPropertyWhenPresent("noticegroupid", row::noticegroupid)
        map(userid).toPropertyWhenPresent("userid", row::userid)
        map(nickname).toPropertyWhenPresent("nickname", row::nickname)
        map(role).toPropertyWhenPresent("role", row::role)
        map(subgroupcreateauthority).toPropertyWhenPresent("subgroupcreateauthority", row::subgroupcreateauthority)
        map(groupadmin).toPropertyWhenPresent("groupadmin", row::groupadmin)
    }

private val columnList = listOf(usergroupid, noticegroupid, userid, nickname, role, subgroupcreateauthority, groupadmin)

fun UserGroupMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, userGroup, completer)

fun UserGroupMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, userGroup, completer)

fun UserGroupMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, userGroup, completer)

fun UserGroupMapper.selectByPrimaryKey(usergroupid_: String) =
    selectOne {
        where { usergroupid isEqualTo usergroupid_ }
    }

fun UserGroupMapper.update(completer: UpdateCompleter) =
    update(this::update, userGroup, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: UserGroup) =
    apply {
        set(usergroupid) equalToOrNull row::usergroupid
        set(noticegroupid) equalToOrNull row::noticegroupid
        set(userid) equalToOrNull row::userid
        set(nickname) equalToOrNull row::nickname
        set(role) equalToOrNull row::role
        set(subgroupcreateauthority) equalToOrNull row::subgroupcreateauthority
        set(groupadmin) equalToOrNull row::groupadmin
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: UserGroup) =
    apply {
        set(usergroupid) equalToWhenPresent row::usergroupid
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        set(userid) equalToWhenPresent row::userid
        set(nickname) equalToWhenPresent row::nickname
        set(role) equalToWhenPresent row::role
        set(subgroupcreateauthority) equalToWhenPresent row::subgroupcreateauthority
        set(groupadmin) equalToWhenPresent row::groupadmin
    }

fun UserGroupMapper.updateByPrimaryKey(row: UserGroup) =
    update {
        set(noticegroupid) equalToOrNull row::noticegroupid
        set(userid) equalToOrNull row::userid
        set(nickname) equalToOrNull row::nickname
        set(role) equalToOrNull row::role
        set(subgroupcreateauthority) equalToOrNull row::subgroupcreateauthority
        set(groupadmin) equalToOrNull row::groupadmin
        where { usergroupid isEqualTo row.usergroupid!! }
    }

fun UserGroupMapper.updateByPrimaryKeySelective(row: UserGroup) =
    update {
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        set(userid) equalToWhenPresent row::userid
        set(nickname) equalToWhenPresent row::nickname
        set(role) equalToWhenPresent row::role
        set(subgroupcreateauthority) equalToWhenPresent row::subgroupcreateauthority
        set(groupadmin) equalToWhenPresent row::groupadmin
        where { usergroupid isEqualTo row.usergroupid!! }
    }

fun UserGroupMapper.updateNicknameToNullByPrimaryKey(id: String) =
    update {
        set(nickname).equalToNull()
        where { usergroupid isEqualTo id }
    }