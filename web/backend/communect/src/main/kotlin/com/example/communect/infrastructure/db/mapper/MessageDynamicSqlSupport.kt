/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import java.time.LocalDateTime
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object MessageDynamicSqlSupport {
    val message = Message()

    val messageid = message.messageid

    val talkid = message.talkid

    val userid = message.userid

    val createtime = message.createtime

    class Message : AliasableSqlTable<Message>("message", ::Message) {
        val messageid = column<String>(name = "messageId", jdbcType = JDBCType.CHAR)

        val talkid = column<String>(name = "talkId", jdbcType = JDBCType.CHAR)

        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)

        val message = column<String>(name = "message", jdbcType = JDBCType.VARCHAR)

        val createtime = column<LocalDateTime>(name = "createTime", jdbcType = JDBCType.TIMESTAMP)
    }
}