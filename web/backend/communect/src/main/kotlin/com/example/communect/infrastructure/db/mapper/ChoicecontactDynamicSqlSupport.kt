/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object ChoicecontactDynamicSqlSupport {
    val choicecontact = Choicecontact()

    val choicecontactid = choicecontact.choicecontactid

    val contactid = choicecontact.contactid

    val choices = choicecontact.choices

    class Choicecontact : AliasableSqlTable<Choicecontact>("choicecontact", ::Choicecontact) {
        val choicecontactid = column<String>(name = "choiceContactId", jdbcType = JDBCType.CHAR)

        val contactid = column<String>(name = "contactId", jdbcType = JDBCType.CHAR)

        val choices = column<String>(name = "choices", jdbcType = JDBCType.VARCHAR)
    }
}