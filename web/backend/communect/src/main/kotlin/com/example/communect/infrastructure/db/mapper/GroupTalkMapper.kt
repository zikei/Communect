/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.mapper

import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport.groupTalk
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport.noticegroupid
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport.talkid
import com.example.communect.infrastructure.db.record.GroupTalk
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
interface GroupTalkMapper : CommonCountMapper, CommonDeleteMapper, CommonInsertMapper<GroupTalk>, CommonUpdateMapper {
    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @Results(id="GroupTalkResult", value = [
        Result(column="talkId", property="talkid", jdbcType=JdbcType.CHAR, id=true),
        Result(column="noticeGroupId", property="noticegroupid", jdbcType=JdbcType.CHAR)
    ])
    fun selectMany(selectStatement: SelectStatementProvider): List<GroupTalk>

    @SelectProvider(type=SqlProviderAdapter::class, method="select")
    @ResultMap("GroupTalkResult")
    fun selectOne(selectStatement: SelectStatementProvider): GroupTalk?
}

fun GroupTalkMapper.count(completer: CountCompleter) =
    countFrom(this::count, groupTalk, completer)

fun GroupTalkMapper.delete(completer: DeleteCompleter) =
    deleteFrom(this::delete, groupTalk, completer)

fun GroupTalkMapper.deleteByPrimaryKey(talkid_: String) =
    delete {
        where { talkid isEqualTo talkid_ }
    }

fun GroupTalkMapper.insert(row: GroupTalk) =
    insert(this::insert, row, groupTalk) {
        map(talkid) toProperty "talkid"
        map(noticegroupid) toProperty "noticegroupid"
    }

fun GroupTalkMapper.insertMultiple(records: Collection<GroupTalk>) =
    insertMultiple(this::insertMultiple, records, groupTalk) {
        map(talkid) toProperty "talkid"
        map(noticegroupid) toProperty "noticegroupid"
    }

fun GroupTalkMapper.insertMultiple(vararg records: GroupTalk) =
    insertMultiple(records.toList())

fun GroupTalkMapper.insertSelective(row: GroupTalk) =
    insert(this::insert, row, groupTalk) {
        map(talkid).toPropertyWhenPresent("talkid", row::talkid)
        map(noticegroupid).toPropertyWhenPresent("noticegroupid", row::noticegroupid)
    }

private val columnList = listOf(talkid, noticegroupid)

fun GroupTalkMapper.selectOne(completer: SelectCompleter) =
    selectOne(this::selectOne, columnList, groupTalk, completer)

fun GroupTalkMapper.select(completer: SelectCompleter) =
    selectList(this::selectMany, columnList, groupTalk, completer)

fun GroupTalkMapper.selectDistinct(completer: SelectCompleter) =
    selectDistinct(this::selectMany, columnList, groupTalk, completer)

fun GroupTalkMapper.selectByPrimaryKey(talkid_: String) =
    selectOne {
        where { talkid isEqualTo talkid_ }
    }

fun GroupTalkMapper.update(completer: UpdateCompleter) =
    update(this::update, groupTalk, completer)

fun KotlinUpdateBuilder.updateAllColumns(row: GroupTalk) =
    apply {
        set(talkid) equalToOrNull row::talkid
        set(noticegroupid) equalToOrNull row::noticegroupid
    }

fun KotlinUpdateBuilder.updateSelectiveColumns(row: GroupTalk) =
    apply {
        set(talkid) equalToWhenPresent row::talkid
        set(noticegroupid) equalToWhenPresent row::noticegroupid
    }

fun GroupTalkMapper.updateByPrimaryKey(row: GroupTalk) =
    update {
        set(noticegroupid) equalToOrNull row::noticegroupid
        where { talkid isEqualTo row.talkid!! }
    }

fun GroupTalkMapper.updateByPrimaryKeySelective(row: GroupTalk) =
    update {
        set(noticegroupid) equalToWhenPresent row::noticegroupid
        where { talkid isEqualTo row.talkid!! }
    }