/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport.aboveid
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport.grouptitle
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport.noticeGroup
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport.noticegroupid
import com.example.communect.infrastructure.db.record.NoticeGroup
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.*
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.*
import org.mybatis.dynamic.sql.util.mybatis3.CommonCountMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonDeleteMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonInsertMapper
import org.mybatis.dynamic.sql.util.mybatis3.CommonUpdateMapper

@Mapper
interface NoticeGroupMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<NoticeGroup>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="NoticeGroupResult", value = [
        Result(column="noticeGroupId", property="noticegroupid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="aboveId", property="aboveid", jdbcType=JdbcType.CHAR),
        Result(column="groupTitle", property="grouptitle", jdbcType=JdbcType.VARCHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<NoticeGroup>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("NoticeGroupResult")
    fun selectOne(selectStatement: SelectStatementProvider): NoticeGroup?
}

fun NoticeGroupMapper.count(completer: CountCompleter) =
    countFrom(this::count, noticeGroup, completer)

fun NoticeGroupMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, noticeGroup, completer)

fun NoticeGroupMapper.deleteByPrimaryKey(noticegroupid_: String) =
    delete {
        where { noticegroupid isEqualTo noticegroupid_ }
    }

fun NoticeGroupMapper.insert(row: NoticeGroup) =
    insert(this::insert, row, noticeGroup) {
        map(noticegroupid) toProperty "noticegroupid"
        map(aboveid) toProperty "aboveid"
        map(grouptitle) toProperty "grouptitle"
    }

fun NoticeGroupMapper.insertMultiple(records: Collection<NoticeGroup>) =
    insertMultiple(this::insertMultiple, records, noticeGroup) {
        map(noticegroupid) toProperty "noticegroupid"
        map(aboveid) toProperty "aboveid"
        map(grouptitle) toProperty "grouptitle"
    }

fun NoticeGroupMapper.insertMultiple(vararg records: NoticeGroup) =
    insertMultiple(records.toList())

fun NoticeGroupMapper.insertSelective(row: NoticeGroup) =
    insert(this::insert, row, noticeGroup) {
        map(noticegroupid).toPropertyWhenPresent("noticegroupid", row::noticegroupid)
        map(aboveid).toPropertyWhenPresent("aboveid", row::aboveid)
        map(grouptitle).toPropertyWhenPresent("grouptitle", row::grouptitle)
    }

private val columnList = listOf(noticegroupid, aboveid, grouptitle)

fun NoticeGroupMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, noticeGroup, completer)

fun NoticeGroupMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, noticeGroup, completer)

fun NoticeGroupMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, noticeGroup, completer)

fun NoticeGroupMapper.selectByPrimaryKey(noticegroupid_: String) =
    selectOne {
        where { noticegroupid isEqualTo noticegroupid_ }
    }

fun NoticeGroupMapper.update(completer: UpdateCompleter) =
    update(this::update, noticeGroup, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: NoticeGroup) =
    apply {
        set(noticegroupid) equalToOrNull row::noticegroupid
        set(aboveid) equalToOrNull row::aboveid
        set(grouptitle) equalToOrNull row::grouptitle
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: NoticeGroup) =
    apply {
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        set(aboveid) equalToWhenPresent row::aboveid
        set(grouptitle) equalToWhenPresent row::grouptitle
    }

fun NoticeGroupMapper.updateByPrimaryKey(row: NoticeGroup) =
    update {
        set(aboveid) equalToOrNull row::aboveid
        set(grouptitle) equalToOrNull row::grouptitle
        where { noticegroupid isEqualTo row.noticegroupid!! }
    }

fun NoticeGroupMapper.updateByPrimaryKeySelective(row: NoticeGroup) =
    update {
        set(aboveid) equalToWhenPresent row::aboveid
        set(grouptitle) equalToWhenPresent row::grouptitle
        where { noticegroupid isEqualTo row.noticegroupid!! }
    }

fun NoticeGroupMapper.updateAboveIdToNullByPrimaryKey(id: String) =
    update {
        set(aboveid).equalToNull()
        where { noticegroupid isEqualTo id }
    }