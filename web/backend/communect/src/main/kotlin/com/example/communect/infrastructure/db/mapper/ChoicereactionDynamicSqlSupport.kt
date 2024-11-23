/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object ChoicereactionDynamicSqlSupport {
    val choicereaction = Choicereaction()

    val reactionid = choicereaction.reactionid

    val choicecontactid = choicereaction.choicecontactid

    class Choicereaction : AliasableSqlTable<Choicereaction>("choicereaction", ::Choicereaction) {
        val reactionid = column<String>(name = "reactionId", jdbcType = JDBCType.CHAR)

        val choicecontactid = column<String>(name = "choiceContactId", jdbcType = JDBCType.CHAR)
    }
}