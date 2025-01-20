/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import java.sql.JDBCType
import java.time.LocalDateTime
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object ContactDynamicSqlSupport {
    val contact = Contact()

    val contactid = contact.contactid

    val noticegroupid = contact.noticegroupid

    val userid = contact.userid

    val message = contact.message

    val contacttype = contact.contacttype

    val importance = contact.importance

    val createtime = contact.createtime

    class Contact : AliasableSqlTable<Contact>("contact", ::Contact) {
        val contactid = column<String>(name = "contactId", jdbcType = JDBCType.CHAR)

        val noticegroupid = column<String>(name = "noticeGroupId", jdbcType = JDBCType.CHAR)

        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)

        val message = column<String>(name = "message", jdbcType = JDBCType.VARCHAR)

        val contacttype = column<ContactType>(name = "contactType", jdbcType = JDBCType.CHAR, typeHandler = "org.apache.ibatis.type.EnumTypeHandler")

        val importance = column<Importance>(name = "importance", jdbcType = JDBCType.CHAR, typeHandler = "org.apache.ibatis.type.EnumTypeHandler")

        val createtime = column<LocalDateTime>(name = "createTime", jdbcType = JDBCType.TIMESTAMP)
    }
}