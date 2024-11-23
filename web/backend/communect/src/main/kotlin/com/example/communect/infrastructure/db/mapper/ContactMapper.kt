/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.contact
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.contactid
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.contacttype
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.createtime
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.importance
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.message
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.noticegroupid
import com.example.communect.infrastructure.db.record.Contact
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
interface ContactMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<Contact>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="ContactResult", value = [
        Result(column="contactId", property="contactid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="noticeGroupId", property="noticegroupid", jdbcType=JdbcType.CHAR),
        Result(column="message", property="message", jdbcType=JdbcType.VARCHAR),
        Result(column="contactType", property="contacttype", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
        Result(column="importance", property="importance", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
        Result(column="createTime", property="createtime", jdbcType=JdbcType.TIMESTAMP)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<Contact>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("ContactResult")
    fun selectOne(selectStatement: SelectStatementProvider): Contact?
}

fun ContactMapper.count(completer: CountCompleter) =
    countFrom(this::count, contact, completer)

fun ContactMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, contact, completer)

fun ContactMapper.deleteByPrimaryKey(contactid_: String) =
    delete {
        where { contactid isEqualTo contactid_ }
    }

fun ContactMapper.insert(row: Contact) =
    insert(this::insert, row, contact) {
        map(contactid) toProperty "contactid"
        map(noticegroupid) toProperty "noticegroupid"
        map(message) toProperty "message"
        map(contacttype) toProperty "contacttype"
        map(importance) toProperty "importance"
        map(createtime) toProperty "createtime"
    }

fun ContactMapper.insertMultiple(records: Collection<Contact>) =
    insertMultiple(this::insertMultiple, records, contact) {
        map(contactid) toProperty "contactid"
        map(noticegroupid) toProperty "noticegroupid"
        map(message) toProperty "message"
        map(contacttype) toProperty "contacttype"
        map(importance) toProperty "importance"
        map(createtime) toProperty "createtime"
    }

fun ContactMapper.insertMultiple(vararg records: Contact) =
    insertMultiple(records.toList())

fun ContactMapper.insertSelective(row: Contact) =
    insert(this::insert, row, contact) {
        map(contactid).toPropertyWhenPresent("contactid", row::contactid)
        map(noticegroupid).toPropertyWhenPresent("noticegroupid", row::noticegroupid)
        map(message).toPropertyWhenPresent("message", row::message)
        map(contacttype).toPropertyWhenPresent("contacttype", row::contacttype)
        map(importance).toPropertyWhenPresent("importance", row::importance)
        map(createtime).toPropertyWhenPresent("createtime", row::createtime)
    }

private val columnList = listOf(contactid, noticegroupid, message, contacttype, importance, createtime)

fun ContactMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, contact, completer)

fun ContactMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, contact, completer)

fun ContactMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, contact, completer)

fun ContactMapper.selectByPrimaryKey(contactid_: String) =
    selectOne {
        where { contactid isEqualTo contactid_ }
    }

fun ContactMapper.update(completer: UpdateCompleter) =
    update(this::update, contact, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: Contact) =
    apply {
        set(contactid) equalToOrNull row::contactid
        set(noticegroupid) equalToOrNull row::noticegroupid
        set(message) equalToOrNull row::message
        set(contacttype) equalToOrNull row::contacttype
        set(importance) equalToOrNull row::importance
        set(createtime) equalToOrNull row::createtime
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: Contact) =
    apply {
        set(contactid) equalToWhenPresent row::contactid
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        set(message) equalToWhenPresent row::message
        set(contacttype) equalToWhenPresent row::contacttype
        set(importance) equalToWhenPresent row::importance
        set(createtime) equalToWhenPresent row::createtime
    }

fun ContactMapper.updateByPrimaryKey(row: Contact) =
    update {
        set(noticegroupid) equalToOrNull row::noticegroupid
        set(message) equalToOrNull row::message
        set(contacttype) equalToOrNull row::contacttype
        set(importance) equalToOrNull row::importance
        set(createtime) equalToOrNull row::createtime
        where { contactid isEqualTo row.contactid!! }
    }

fun ContactMapper.updateByPrimaryKeySelective(row: Contact) =
    update {
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        set(message) equalToWhenPresent row::message
        set(contacttype) equalToWhenPresent row::contacttype
        set(importance) equalToWhenPresent row::importance
        set(createtime) equalToWhenPresent row::createtime
        where { contactid isEqualTo row.contactid!! }
    }