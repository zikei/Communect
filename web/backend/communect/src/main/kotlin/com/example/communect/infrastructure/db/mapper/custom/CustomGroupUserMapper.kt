package com.example.communect.infrastructure.db.mapper.custom

import com.example.communect.infrastructure.db.record.custom.CustomGroupUser
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as User
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.user as userTable
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroup
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userGroup as userGroupTable
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.EnumTypeHandler
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.elements.count
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.select

@Mapper
interface CustomGroupUserMapper {
    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @Results(
        id = "CustomGroupUserRecordResult", value = [
            Result(column="userGroupId", property="groupuserid", jdbcType=JdbcType.CHAR, id=true),
            Result(column="noticeGroupId", property="groupid", jdbcType=JdbcType.CHAR),
            Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
            Result(column="userName", property="username", jdbcType=JdbcType.VARCHAR),
            Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
            Result(column="groupNickname", property="groupnickname", jdbcType=JdbcType.VARCHAR),
            Result(column="role", property="role", typeHandler= EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
            Result(column="subGroupCreateAuthority", property="issubgroupcreate", jdbcType=JdbcType.BIT),
            Result(column="groupAdmin", property="isadmin", jdbcType=JdbcType.BIT)
        ]
    )
    fun selectMany(selectStatement: SelectStatementProvider) : List<CustomGroupUser>

    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @ResultMap("CustomGroupUserRecordResult")
    fun selectOne(selectStatement: SelectStatementProvider) : CustomGroupUser?
}

private val columnList = listOf(
    UserGroup.usergroupid,
    UserGroup.noticegroupid,
    UserGroup.userid,
    User.username,
    User.nickname,
    UserGroup.nickname.`as`("groupNickname"),
    UserGroup.role,
    UserGroup.subgroupcreateauthority,
    UserGroup.groupadmin
)

fun CustomGroupUserMapper.selectByGroupId(groupId: String): List<CustomGroupUser> {
    val selectStatement = select(columnList){
        from(userGroupTable, "ug")
        leftJoin(userTable, "u"){
            on(UserGroup.userid) equalTo(User.userid)
        }
        where {
            UserGroup.noticegroupid isEqualTo groupId
        }
    }
    return selectMany(selectStatement)
}