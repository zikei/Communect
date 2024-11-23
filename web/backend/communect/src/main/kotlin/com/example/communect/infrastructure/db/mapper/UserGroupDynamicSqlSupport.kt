/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.domain.enums.GroupRole
import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object UserGroupDynamicSqlSupport {
    val userGroup = UserGroup()

    val usergroupid = userGroup.usergroupid

    val noticegroupid = userGroup.noticegroupid

    val userid = userGroup.userid

    val nickname = userGroup.nickname

    val role = userGroup.role

    val subgroupcreateauthority = userGroup.subgroupcreateauthority

    val groupadmin = userGroup.groupadmin

    class UserGroup : AliasableSqlTable<UserGroup>("user_group", ::UserGroup) {
        val usergroupid = column<String>(name = "userGroupId", jdbcType = JDBCType.CHAR)

        val noticegroupid = column<String>(name = "noticeGroupId", jdbcType = JDBCType.CHAR)

        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)

        val nickname = column<String>(name = "nickname", jdbcType = JDBCType.VARCHAR)

        val role = column<GroupRole>(name = "role", jdbcType = JDBCType.CHAR, typeHandler = "org.apache.ibatis.type.EnumTypeHandler")

        val subgroupcreateauthority = column<Boolean>(name = "subGroupCreateAuthority", jdbcType = JDBCType.BIT)

        val groupadmin = column<Boolean>(name = "groupAdmin", jdbcType = JDBCType.BIT)
    }
}