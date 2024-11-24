/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport.choicecontact
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport.choicecontactid
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport.choices
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport.contactid
import com.example.communect.infrastructure.db.record.Choicecontact
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
interface ChoicecontactMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Choicecontact>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="ChoicecontactResult", value = [
        Result(column="choiceContactId", property="choicecontactid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="contactId", property="contactid", jdbcType=JdbcType.CHAR),
        Result(column="choices", property="choices", jdbcType=JdbcType.VARCHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Choicecontact>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("ChoicecontactResult")
    fun selectOne(selectStatement: SelectStatementProvider): Choicecontact?
}

fun ChoicecontactMapper.count(completer: CountCompleter) =
    countFrom(this::count, choicecontact, completer)

fun ChoicecontactMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, choicecontact, completer)

fun ChoicecontactMapper.deleteByPrimaryKey(choicecontactid_: String) =
    delete {
        where { choicecontactid isEqualTo choicecontactid_ }
    }

fun ChoicecontactMapper.insert(row: Choicecontact) =
    insert(this::insert, row, choicecontact) {
        map(choicecontactid) toProperty "choicecontactid"
        map(contactid) toProperty "contactid"
        map(choices) toProperty "choices"
    }

fun ChoicecontactMapper.insertMultiple(records: Collection<Choicecontact>) =
    insertMultiple(this::insertMultiple, records, choicecontact) {
        map(choicecontactid) toProperty "choicecontactid"
        map(contactid) toProperty "contactid"
        map(choices) toProperty "choices"
    }

fun ChoicecontactMapper.insertMultiple(vararg records: Choicecontact) =
    insertMultiple(records.toList())

fun ChoicecontactMapper.insertSelective(row: Choicecontact) =
    insert(this::insert, row, choicecontact) {
        map(choicecontactid).toPropertyWhenPresent("choicecontactid", row::choicecontactid)
        map(contactid).toPropertyWhenPresent("contactid", row::contactid)
        map(choices).toPropertyWhenPresent("choices", row::choices)
    }

private val columnList = listOf(choicecontactid, contactid, choices)

fun ChoicecontactMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, choicecontact, completer)

fun ChoicecontactMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, choicecontact, completer)

fun ChoicecontactMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, choicecontact, completer)

fun ChoicecontactMapper.selectByPrimaryKey(choicecontactid_: String) =
    selectOne {
        where { choicecontactid isEqualTo choicecontactid_ }
    }

fun ChoicecontactMapper.update(completer: UpdateCompleter) =
    update(this::update, choicecontact, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Choicecontact) =
    apply {
        set(choicecontactid) equalToOrNull row::choicecontactid
        set(contactid) equalToOrNull row::contactid
        set(choices) equalToOrNull row::choices
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Choicecontact) =
    apply {
        set(choicecontactid) equalToWhenPresent row::choicecontactid
        set(contactid) equalToWhenPresent row::contactid
        set(choices) equalToWhenPresent row::choices
    }

fun ChoicecontactMapper.updateByPrimaryKey(row: Choicecontact) =
    update {
        set(contactid) equalToOrNull row::contactid
        set(choices) equalToOrNull row::choices
        where { choicecontactid isEqualTo row.choicecontactid!! }
    }

fun ChoicecontactMapper.updateByPrimaryKeySelective(row: Choicecontact) =
    update {
        set(contactid) equalToWhenPresent row::contactid
        set(choices) equalToWhenPresent row::choices
        where { choicecontactid isEqualTo row.choicecontactid!! }
    }