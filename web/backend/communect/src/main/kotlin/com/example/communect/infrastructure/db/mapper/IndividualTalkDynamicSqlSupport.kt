/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object IndividualTalkDynamicSqlSupport {
    val individualTalk = IndividualTalk()

    val individualtalkid = individualTalk.individualtalkid

    val talkid = individualTalk.talkid

    val userid = individualTalk.userid

    class IndividualTalk : AliasableSqlTable<IndividualTalk>("individual_talk", ::IndividualTalk) {
        val individualtalkid = column<String>(name = "individualTalkId", jdbcType = JDBCType.CHAR)

        val talkid = column<String>(name = "talkId", jdbcType = JDBCType.CHAR)

        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)
    }
}