/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.contactid
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.reaction
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.reactionid
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.reactiontime
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.userid
import com.example.communect.infrastructure.db.record.Reaction
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
interface ReactionMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Reaction>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="ReactionResult", value = [
        Result(column="reactionId", property="reactionid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="contactId", property="contactid", jdbcType=JdbcType.CHAR),
        Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
        Result(column="reactionTime", property="reactiontime", jdbcType=JdbcType.TIMESTAMP)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Reaction>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("ReactionResult")
    fun selectOne(selectStatement: SelectStatementProvider): Reaction?
}

fun ReactionMapper.count(completer: CountCompleter) =
    countFrom(this::count, reaction, completer)

fun ReactionMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, reaction, completer)

fun ReactionMapper.deleteByPrimaryKey(reactionid_: String) =
    delete {
        where { reactionid isEqualTo reactionid_ }
    }

fun ReactionMapper.insert(row: Reaction) =
    insert(this::insert, row, reaction) {
        map(reactionid) toProperty "reactionid"
        map(contactid) toProperty "contactid"
        map(userid) toProperty "userid"
        map(reactiontime) toProperty "reactiontime"
    }

fun ReactionMapper.insertMultiple(records: Collection<Reaction>) =
    insertMultiple(this::insertMultiple, records, reaction) {
        map(reactionid) toProperty "reactionid"
        map(contactid) toProperty "contactid"
        map(userid) toProperty "userid"
        map(reactiontime) toProperty "reactiontime"
    }

fun ReactionMapper.insertMultiple(vararg records: Reaction) =
    insertMultiple(records.toList())

fun ReactionMapper.insertSelective(row: Reaction) =
    insert(this::insert, row, reaction) {
        map(reactionid).toPropertyWhenPresent("reactionid", row::reactionid)
        map(contactid).toPropertyWhenPresent("contactid", row::contactid)
        map(userid).toPropertyWhenPresent("userid", row::userid)
        map(reactiontime).toPropertyWhenPresent("reactiontime", row::reactiontime)
    }

private val columnList = listOf(reactionid, contactid, userid, reactiontime)

fun ReactionMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, reaction, completer)

fun ReactionMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, reaction, completer)

fun ReactionMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, reaction, completer)

fun ReactionMapper.selectByPrimaryKey(reactionid_: String) =
    selectOne {
        where { reactionid isEqualTo reactionid_ }
    }

fun ReactionMapper.update(completer: UpdateCompleter) =
    update(this::update, reaction, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Reaction) =
    apply {
        set(reactionid) equalToOrNull row::reactionid
        set(contactid) equalToOrNull row::contactid
        set(userid) equalToOrNull row::userid
        set(reactiontime) equalToOrNull row::reactiontime
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Reaction) =
    apply {
        set(reactionid) equalToWhenPresent row::reactionid
        set(contactid) equalToWhenPresent row::contactid
        set(userid) equalToWhenPresent row::userid
        set(reactiontime) equalToWhenPresent row::reactiontime
    }

fun ReactionMapper.updateByPrimaryKey(row: Reaction) =
    update {
        set(contactid) equalToOrNull row::contactid
        set(userid) equalToOrNull row::userid
        set(reactiontime) equalToOrNull row::reactiontime
        where { reactionid isEqualTo row.reactionid!! }
    }

fun ReactionMapper.updateByPrimaryKeySelective(row: Reaction) =
    update {
        set(contactid) equalToWhenPresent row::contactid
        set(userid) equalToWhenPresent row::userid
        set(reactiontime) equalToWhenPresent row::reactiontime
        where { reactionid isEqualTo row.reactionid!! }
    }