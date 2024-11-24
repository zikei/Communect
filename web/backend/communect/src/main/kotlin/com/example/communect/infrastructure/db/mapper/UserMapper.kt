/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.apikey
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.email
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.nickname
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.password
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.user
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.userid
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.username
import com.example.communect.infrastructure.db.record.User
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Result
import org.apache.ibatis.annotations.ResultMap
import org.apache.ibatis.annotations.Results
import org.apache.ibatis.annotations.SelectProvider
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.CountCompleter
import org.mybatis.dynamic.sql.util.kotlin.DeleteCompleter
import org.mybatis.dynamic.sql.util.kotlin.KotlinUpdateBuilder
import org.mybatis.dynamic.sql.util.kotlin.SelectCompleter
import org.mybatis.dynamic.sql.util.kotlin.UpdateCompleter
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.countFrom
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.deleteFrom
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.insert
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.insertMultiple
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.selectDistinct
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.selectList
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.selectOne
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.update
import org.mybatis.dynamic.sql.util.mybatis3.CommonCountMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonDeleteMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonInsertMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonUpdateMapper

@Mapper
interface UserMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<User>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="UserResult", value = [
        Result(column="userId", property="userid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="userName", property="username", jdbcType=JdbcType.VARCHAR),
        Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
        Result(column="password", property="password", jdbcType=JdbcType.VARCHAR),
        Result(column="email", property="email", jdbcType=JdbcType.VARCHAR),
        Result(column="apikey", property="apikey", jdbcType=JdbcType.VARCHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<User>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("UserResult")
    fun selectOne(selectStatement: SelectStatementProvider): User?
}

fun UserMapper.count(completer: CountCompleter) =
    countFrom(this::count, user, completer)

fun UserMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, user, completer)

fun UserMapper.deleteByPrimaryKey(userid_: String) =
    delete {
        where { userid isEqualTo userid_ }
    }

fun UserMapper.insert(row: User) =
    insert(this::insert, row, user) {
        map(userid) toProperty "userid"
        map(username) toProperty "username"
        map(nickname) toProperty "nickname"
        map(password) toProperty "password"
        map(email) toProperty "email"
        map(apikey) toProperty "apikey"
    }

fun UserMapper.insertMultiple(records: Collection<User>) =
    insertMultiple(this::insertMultiple, records, user) {
        map(userid) toProperty "userid"
        map(username) toProperty "username"
        map(nickname) toProperty "nickname"
        map(password) toProperty "password"
        map(email) toProperty "email"
        map(apikey) toProperty "apikey"
    }

fun UserMapper.insertMultiple(vararg records: User) =
    insertMultiple(records.toList())

fun UserMapper.insertSelective(row: User) =
    insert(this::insert, row, user) {
        map(userid).toPropertyWhenPresent("userid", row::userid)
        map(username).toPropertyWhenPresent("username", row::username)
        map(nickname).toPropertyWhenPresent("nickname", row::nickname)
        map(password).toPropertyWhenPresent("password", row::password)
        map(email).toPropertyWhenPresent("email", row::email)
        map(apikey).toPropertyWhenPresent("apikey", row::apikey)
    }

private val columnList = listOf(userid, username, nickname, password, email, apikey)

fun UserMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, user, completer)

fun UserMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, user, completer)

fun UserMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, user, completer)

fun UserMapper.selectByPrimaryKey(userid_: String) =
    selectOne {
        where { userid isEqualTo userid_ }
    }

fun UserMapper.update(completer: UpdateCompleter) =
    update(this::update, user, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: User) =
    apply {
        set(userid) equalToOrNull row::userid
        set(username) equalToOrNull row::username
        set(nickname) equalToOrNull row::nickname
        set(password) equalToOrNull row::password
        set(email) equalToOrNull row::email
        set(apikey) equalToOrNull row::apikey
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: User) =
    apply {
        set(userid) equalToWhenPresent row::userid
        set(username) equalToWhenPresent row::username
        set(nickname) equalToWhenPresent row::nickname
        set(password) equalToWhenPresent row::password
        set(email) equalToWhenPresent row::email
        set(apikey) equalToWhenPresent row::apikey
    }

fun UserMapper.updateByPrimaryKey(row: User) =
    update {
        set(username) equalToOrNull row::username
        set(nickname) equalToOrNull row::nickname
        set(password) equalToOrNull row::password
        set(email) equalToOrNull row::email
        set(apikey) equalToOrNull row::apikey
        where { userid isEqualTo row.userid!! }
    }

fun UserMapper.updateByPrimaryKeySelective(row: User) =
    update {
        set(username) equalToWhenPresent row::username
        set(nickname) equalToWhenPresent row::nickname
        set(password) equalToWhenPresent row::password
        set(email) equalToWhenPresent row::email
        set(apikey) equalToWhenPresent row::apikey
        where { userid isEqualTo row.userid!! }
    }