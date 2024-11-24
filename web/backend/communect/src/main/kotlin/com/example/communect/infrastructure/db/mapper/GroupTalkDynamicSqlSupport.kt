/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object GroupTalkDynamicSqlSupport {
    val groupTalk = GroupTalk()

    val talkid = groupTalk.talkid

    val noticegroupid = groupTalk.noticegroupid

    class GroupTalk : AliasableSqlTable<GroupTalk>("group_talk", ::GroupTalk) {
        val talkid = column<String>(name = "talkId", jdbcType = JDBCType.CHAR)

        val noticegroupid = column<String>(name = "noticeGroupId", jdbcType = JDBCType.CHAR)
    }
}