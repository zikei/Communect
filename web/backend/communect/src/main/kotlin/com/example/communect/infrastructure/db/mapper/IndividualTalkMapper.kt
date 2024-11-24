/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport.individualTalk
import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport.individualtalkid
import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport.talkid
import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport.userid
import com.example.communect.infrastructure.db.record.IndividualTalk
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
interface IndividualTalkMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<IndividualTalk>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="IndividualTalkResult", value = [
        Result(column="individualTalkId", property="individualtalkid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="talkId", property="talkid", jdbcType=JdbcType.CHAR),
        Result(column="userId", property="userid", jdbcType=JdbcType.CHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<IndividualTalk>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("IndividualTalkResult")
    fun selectOne(selectStatement: SelectStatementProvider): IndividualTalk?
}

fun IndividualTalkMapper.count(completer: CountCompleter) =
    countFrom(this::count, individualTalk, completer)

fun IndividualTalkMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, individualTalk, completer)

fun IndividualTalkMapper.deleteByPrimaryKey(individualtalkid_: String) =
    delete {
        where { individualtalkid isEqualTo individualtalkid_ }
    }

fun IndividualTalkMapper.insert(row: IndividualTalk) =
    insert(this::insert, row, individualTalk) {
        map(individualtalkid) toProperty "individualtalkid"
        map(talkid) toProperty "talkid"
        map(userid) toProperty "userid"
    }

fun IndividualTalkMapper.insertMultiple(records: Collection<IndividualTalk>) =
    insertMultiple(this::insertMultiple, records, individualTalk) {
        map(individualtalkid) toProperty "individualtalkid"
        map(talkid) toProperty "talkid"
        map(userid) toProperty "userid"
    }

fun IndividualTalkMapper.insertMultiple(vararg records: IndividualTalk) =
    insertMultiple(records.toList())

fun IndividualTalkMapper.insertSelective(row: IndividualTalk) =
    insert(this::insert, row, individualTalk) {
        map(individualtalkid).toPropertyWhenPresent("individualtalkid", row::individualtalkid)
        map(talkid).toPropertyWhenPresent("talkid", row::talkid)
        map(userid).toPropertyWhenPresent("userid", row::userid)
    }

private val columnList = listOf(individualtalkid, talkid, userid)

fun IndividualTalkMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, individualTalk, completer)

fun IndividualTalkMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, individualTalk, completer)

fun IndividualTalkMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, individualTalk, completer)

fun IndividualTalkMapper.selectByPrimaryKey(individualtalkid_: String) =
    selectOne {
        where { individualtalkid isEqualTo individualtalkid_ }
    }

fun IndividualTalkMapper.update(completer: UpdateCompleter) =
    update(this::update, individualTalk, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: IndividualTalk) =
    apply {
        set(individualtalkid) equalToOrNull row::individualtalkid
        set(talkid) equalToOrNull row::talkid
        set(userid) equalToOrNull row::userid
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: IndividualTalk) =
    apply {
        set(individualtalkid) equalToWhenPresent row::individualtalkid
        set(talkid) equalToWhenPresent row::talkid
        set(userid) equalToWhenPresent row::userid
    }

fun IndividualTalkMapper.updateByPrimaryKey(row: IndividualTalk) =
    update {
        set(talkid) equalToOrNull row::talkid
        set(userid) equalToOrNull row::userid
        where { individualtalkid isEqualTo row.individualtalkid!! }
    }

fun IndividualTalkMapper.updateByPrimaryKeySelective(row: IndividualTalk) =
    update {
        set(talkid) equalToWhenPresent row::talkid
        set(userid) equalToWhenPresent row::userid
        where { individualtalkid isEqualTo row.individualtalkid!! }
    }