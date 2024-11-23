/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport.talk
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport.talkid
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport.talktitle
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport.talktype
import com.example.communect.infrastructure.db.record.Talk
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Result
import org.apache.ibatis.annotations.ResultMap
import org.apache.ibatis.annotations.Results
import org.apache.ibatis.annotations.SelectProvider
import org.apache.ibatis.type.EnumTypeHandler
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
interface TalkMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Talk>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="TalkResult", value = [
        Result(column="talkId", property="talkid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="talkTitle", property="talktitle", jdbcType=JdbcType.VARCHAR),
        Result(column="talkType", property="talktype", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Talk>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("TalkResult")
    fun selectOne(selectStatement: SelectStatementProvider): Talk?
}

fun TalkMapper.count(completer: CountCompleter) =
    countFrom(this::count, talk, completer)

fun TalkMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, talk, completer)

fun TalkMapper.deleteByPrimaryKey(talkid_: String) =
    delete {
        where { talkid isEqualTo talkid_ }
    }

fun TalkMapper.insert(row: Talk) =
    insert(this::insert, row, talk) {
        map(talkid) toProperty "talkid"
        map(talktitle) toProperty "talktitle"
        map(talktype) toProperty "talktype"
    }

fun TalkMapper.insertMultiple(records: Collection<Talk>) =
    insertMultiple(this::insertMultiple, records, talk) {
        map(talkid) toProperty "talkid"
        map(talktitle) toProperty "talktitle"
        map(talktype) toProperty "talktype"
    }

fun TalkMapper.insertMultiple(vararg records: Talk) =
    insertMultiple(records.toList())

fun TalkMapper.insertSelective(row: Talk) =
    insert(this::insert, row, talk) {
        map(talkid).toPropertyWhenPresent("talkid", row::talkid)
        map(talktitle).toPropertyWhenPresent("talktitle", row::talktitle)
        map(talktype).toPropertyWhenPresent("talktype", row::talktype)
    }

private val columnList = listOf(talkid, talktitle, talktype)

fun TalkMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, talk, completer)

fun TalkMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, talk, completer)

fun TalkMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, talk, completer)

fun TalkMapper.selectByPrimaryKey(talkid_: String) =
    selectOne {
        where { talkid isEqualTo talkid_ }
    }

fun TalkMapper.update(completer: UpdateCompleter) =
    update(this::update, talk, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Talk) =
    apply {
        set(talkid) equalToOrNull row::talkid
        set(talktitle) equalToOrNull row::talktitle
        set(talktype) equalToOrNull row::talktype
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Talk) =
    apply {
        set(talkid) equalToWhenPresent row::talkid
        set(talktitle) equalToWhenPresent row::talktitle
        set(talktype) equalToWhenPresent row::talktype
    }

fun TalkMapper.updateByPrimaryKey(row: Talk) =
    update {
        set(talktitle) equalToOrNull row::talktitle
        set(talktype) equalToOrNull row::talktype
        where { talkid isEqualTo row.talkid!! }
    }

fun TalkMapper.updateByPrimaryKeySelective(row: Talk) =
    update {
        set(talktitle) equalToWhenPresent row::talktitle
        set(talktype) equalToWhenPresent row::talktype
        where { talkid isEqualTo row.talkid!! }
    }