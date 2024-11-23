/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import java.time.LocalDateTime
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object ReactionDynamicSqlSupport {
    val reaction = Reaction()

    val reactionid = reaction.reactionid

    val contactid = reaction.contactid

    val userid = reaction.userid

    val reactiontime = reaction.reactiontime

    class Reaction : AliasableSqlTable<Reaction>("reaction", ::Reaction) {
        val reactionid = column<String>(name = "reactionId", jdbcType = JDBCType.CHAR)

        val contactid = column<String>(name = "contactId", jdbcType = JDBCType.CHAR)

        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)

        val reactiontime = column<LocalDateTime>(name = "reactionTime", jdbcType = JDBCType.TIMESTAMP)
    }
}