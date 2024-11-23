/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import java.sql.JDBCType
import org.mybatis.dynamic.sql.AliasableSqlTable
import org.mybatis.dynamic.sql.util.kotlin.elements.column

object UserDynamicSqlSupport {
    val user = User()

    val userid = user.userid

    val username = user.username

    val nickname = user.nickname

    val password = user.password

    val email = user.email

    val apikey = user.apikey

    class User : AliasableSqlTable<User>("user", ::User) {
        val userid = column<String>(name = "userId", jdbcType = JDBCType.CHAR)

        val username = column<String>(name = "userName", jdbcType = JDBCType.VARCHAR)

        val nickname = column<String>(name = "nickname", jdbcType = JDBCType.VARCHAR)

        val password = column<String>(name = "password", jdbcType = JDBCType.VARCHAR)

        val email = column<String>(name = "email", jdbcType = JDBCType.VARCHAR)

        val apikey = column<String>(name = "apikey", jdbcType = JDBCType.VARCHAR)
    }
}