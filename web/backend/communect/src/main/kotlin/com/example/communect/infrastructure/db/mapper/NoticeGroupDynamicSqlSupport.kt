/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object NoticeGroupDynamicSqlSupport {
    val noticeGroup = NoticeGroup()

    val noticegroupid = noticeGroup.noticegroupid

    val aboveid = noticeGroup.aboveid

    val grouptitle = noticeGroup.grouptitle

    class NoticeGroup : AliasableSqlTable<NoticeGroup>("notice_group", ::NoticeGroup) {
        val noticegroupid = column<String>(name = "noticeGroupId", jdbcType = JDBCType.CHAR)

        val aboveid = column<String>(name = "aboveId", jdbcType = JDBCType.CHAR)

        val grouptitle = column<String>(name = "groupTitle", jdbcType = JDBCType.VARCHAR)
    }
}