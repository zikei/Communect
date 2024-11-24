/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.createtime
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.message
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.messageid
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.talkid
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.userid
import com.example.communect.infrastructure.db.record.Message
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
interface MessageMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Message>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="MessageResult", value = [
        Result(column="messageId", property="messageid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="talkId", property="talkid", jdbcType=JdbcType.CHAR),
        Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
        Result(column="message", property="message", jdbcType=JdbcType.VARCHAR),
        Result(column="createTime", property="createtime", jdbcType=JdbcType.TIMESTAMP)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Message>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("MessageResult")
    fun selectOne(selectStatement: SelectStatementProvider): Message?
}

fun MessageMapper.count(completer: CountCompleter) =
    countFrom(this::count, message, completer)

fun MessageMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, message, completer)

fun MessageMapper.deleteByPrimaryKey(messageid_: String) =
    delete {
        where { messageid isEqualTo messageid_ }
    }

fun MessageMapper.insert(row: Message) =
    insert(this::insert, row, message) {
        map(messageid) toProperty "messageid"
        map(talkid) toProperty "talkid"
        map(userid) toProperty "userid"
        map(message.message) toProperty "message"
        map(createtime) toProperty "createtime"
    }

fun MessageMapper.insertMultiple(records: Collection<Message>) =
    insertMultiple(this::insertMultiple, records, message) {
        map(messageid) toProperty "messageid"
        map(talkid) toProperty "talkid"
        map(userid) toProperty "userid"
        map(message.message) toProperty "message"
        map(createtime) toProperty "createtime"
    }

fun MessageMapper.insertMultiple(vararg records: Message) =
    insertMultiple(records.toList())

fun MessageMapper.insertSelective(row: Message) =
    insert(this::insert, row, message) {
        map(messageid).toPropertyWhenPresent("messageid", row::messageid)
        map(talkid).toPropertyWhenPresent("talkid", row::talkid)
        map(userid).toPropertyWhenPresent("userid", row::userid)
        map(message.message).toPropertyWhenPresent("message", row::message)
        map(createtime).toPropertyWhenPresent("createtime", row::createtime)
    }

private val columnList = listOf(messageid, talkid, userid, message.message, createtime)

fun MessageMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, message, completer)

fun MessageMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, message, completer)

fun MessageMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, message, completer)

fun MessageMapper.selectByPrimaryKey(messageid_: String) =
    selectOne {
        where { messageid isEqualTo messageid_ }
    }

fun MessageMapper.update(completer: UpdateCompleter) =
    update(this::update, message, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Message) =
    apply {
        set(messageid) equalToOrNull row::messageid
        set(talkid) equalToOrNull row::talkid
        set(userid) equalToOrNull row::userid
        set(message.message) equalToOrNull row::message
        set(createtime) equalToOrNull row::createtime
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Message) =
    apply {
        set(messageid) equalToWhenPresent row::messageid
        set(talkid) equalToWhenPresent row::talkid
        set(userid) equalToWhenPresent row::userid
        set(message.message) equalToWhenPresent row::message
        set(createtime) equalToWhenPresent row::createtime
    }

fun MessageMapper.updateByPrimaryKey(row: Message) =
    update {
        set(talkid) equalToOrNull row::talkid
        set(userid) equalToOrNull row::userid
        set(message.message) equalToOrNull row::message
        set(createtime) equalToOrNull row::createtime
        where { messageid isEqualTo row.messageid!! }
    }

fun MessageMapper.updateByPrimaryKeySelective(row: Message) =
    update {
        set(talkid) equalToWhenPresent row::talkid
        set(userid) equalToWhenPresent row::userid
        set(message.message) equalToWhenPresent row::message
        set(createtime) equalToWhenPresent row::createtime
        where { messageid isEqualTo row.messageid!! }
    }