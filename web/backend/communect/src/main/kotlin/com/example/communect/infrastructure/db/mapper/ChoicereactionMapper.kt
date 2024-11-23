/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.ChoicereactionDynamicSqlSupport.choicecontactid
import com.example.communect.infrastructure.db.mapper.ChoicereactionDynamicSqlSupport.choicereaction
import com.example.communect.infrastructure.db.mapper.ChoicereactionDynamicSqlSupport.reactionid
import com.example.communect.infrastructure.db.record.Choicereaction
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
interface ChoicereactionMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Choicereaction>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="ChoicereactionResult", value = [
        Result(column="reactionId", property="reactionid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="choiceContactId", property="choicecontactid", jdbcType=JdbcType.CHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Choicereaction>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("ChoicereactionResult")
    fun selectOne(selectStatement: SelectStatementProvider): Choicereaction?
}

fun ChoicereactionMapper.count(completer: CountCompleter) =
    countFrom(this::count, choicereaction, completer)

fun ChoicereactionMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, choicereaction, completer)

fun ChoicereactionMapper.deleteByPrimaryKey(reactionid_: String) =
    delete {
        where { reactionid isEqualTo reactionid_ }
    }

fun ChoicereactionMapper.insert(row: Choicereaction) =
    insert(this::insert, row, choicereaction) {
        map(reactionid) toProperty "reactionid"
        map(choicecontactid) toProperty "choicecontactid"
    }

fun ChoicereactionMapper.insertMultiple(records: Collection<Choicereaction>) =
    insertMultiple(this::insertMultiple, records, choicereaction) {
        map(reactionid) toProperty "reactionid"
        map(choicecontactid) toProperty "choicecontactid"
    }

fun ChoicereactionMapper.insertMultiple(vararg records: Choicereaction) =
    insertMultiple(records.toList())

fun ChoicereactionMapper.insertSelective(row: Choicereaction) =
    insert(this::insert, row, choicereaction) {
        map(reactionid).toPropertyWhenPresent("reactionid", row::reactionid)
        map(choicecontactid).toPropertyWhenPresent("choicecontactid", row::choicecontactid)
    }

private val columnList = listOf(reactionid, choicecontactid)

fun ChoicereactionMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, choicereaction, completer)

fun ChoicereactionMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, choicereaction, completer)

fun ChoicereactionMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, choicereaction, completer)

fun ChoicereactionMapper.selectByPrimaryKey(reactionid_: String) =
    selectOne {
        where { reactionid isEqualTo reactionid_ }
    }

fun ChoicereactionMapper.update(completer: UpdateCompleter) =
    update(this::update, choicereaction, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Choicereaction) =
    apply {
        set(reactionid) equalToOrNull row::reactionid
        set(choicecontactid) equalToOrNull row::choicecontactid
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Choicereaction) =
    apply {
        set(reactionid) equalToWhenPresent row::reactionid
        set(choicecontactid) equalToWhenPresent row::choicecontactid
    }

fun ChoicereactionMapper.updateByPrimaryKey(row: Choicereaction) =
    update {
        set(choicecontactid) equalToOrNull row::choicecontactid
        where { reactionid isEqualTo row.reactionid!! }
    }

fun ChoicereactionMapper.updateByPrimaryKeySelective(row: Choicereaction) =
    update {
        set(choicecontactid) equalToWhenPresent row::choicecontactid
        where { reactionid isEqualTo row.reactionid!! }
    }