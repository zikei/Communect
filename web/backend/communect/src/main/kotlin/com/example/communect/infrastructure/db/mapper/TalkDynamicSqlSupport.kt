/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.domain.enums.TalkType
import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object TalkDynamicSqlSupport {
    val talk = Talk()

    val talkid = talk.talkid

    val talktitle = talk.talktitle

    val talktype = talk.talktype

    class Talk : AliasableSqlTable<Talk>("talk", ::Talk) {
        val talkid = column<String>(name = "talkId", jdbcType = JDBCType.CHAR)

        val talktitle = column<String>(name = "talkTitle", jdbcType = JDBCType.VARCHAR)

        val talktype = column<TalkType>(name = "talkType", jdbcType = JDBCType.CHAR, typeHandler = "org.apache.ibatis.type.EnumTypeHandler")
    }
}