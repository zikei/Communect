package com.example.communect.infrastructure.db.mapper.custom

import com.example.communect.infrastructure.db.record.custom.CustomContact
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.EnumTypeHandler
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.select
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport as Contact
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.contact as contactTable
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as User
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.user as userTable
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroup
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userGroup as userGroupTable
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport as Group
import com.example.communect.infrastructure.db.mapper.NoticeGroupDynamicSqlSupport.noticeGroup as GroupTable

@Mapper
interface CustomContactMapper {
    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @Results(
        id = "CustomContactRecordResult", value = [
            Result(column="contactId", property="contactid", jdbcType=JdbcType.CHAR, id=true),
            Result(column="noticeGroupId", property="groupid", jdbcType=JdbcType.CHAR),
            Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
            Result(column="userName", property="username", jdbcType=JdbcType.VARCHAR),
            Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
            Result(column="groupNickname", property="groupnickname", jdbcType=JdbcType.VARCHAR),
            Result(column="groupTitle", property="groupname", jdbcType=JdbcType.VARCHAR),
            Result(column="message", property="message", jdbcType=JdbcType.VARCHAR),
            Result(column="contactType", property="contacttype", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
            Result(column="importance", property="importance", typeHandler=EnumTypeHandler::class, jdbcType=JdbcType.CHAR),
            Result(column="createTime", property="createtime", jdbcType=JdbcType.TIMESTAMP)
        ]
    )
    fun selectMany(selectStatement: SelectStatementProvider) : List<CustomContact>

    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @ResultMap("CustomContactRecordResult")
    fun selectOne(selectStatement: SelectStatementProvider) : CustomContact?
}

private val columnList = listOf(
    Contact.contactid,
    Contact.noticegroupid,
    Contact.userid,
    User.username,
    User.nickname,
    UserGroup.nickname.`as`("groupNickname"),
    Group.grouptitle,
    Contact.message,
    Contact.contacttype,
    Contact.importance,
    Contact.createtime
)

fun CustomContactMapper.selectByGroupIdAndContactId(groupId: String, lastContactId: String?, readLimit: Long?): List<CustomContact> {
    val selectStatement = select(columnList){
        from(contactTable, "c")
        leftJoin(userTable, "u"){
            on(Contact.userid) equalTo(User.userid)
        }
        leftJoin(GroupTable, "g"){
            on(Contact.noticegroupid) equalTo(Group.noticegroupid)
        }
        leftJoin(userGroupTable, "ug"){
            on(Contact.userid) equalTo (UserGroup.userid)
            and(Contact.noticegroupid) equalTo(UserGroup.noticegroupid)
        }
        where {
            Contact.noticegroupid isEqualTo groupId
            lastContactId?.let {
                and{
                    Contact.createtime isLessThan  {
                        select(Contact.createtime){
                            from(contactTable, "c2")
                            where {
                                Contact.contactid isEqualTo lastContactId
                            }
                        }
                    }
                }
            }
        }
        orderBy(Contact.createtime.descending())
        readLimit?.let { limit(readLimit) }
    }
    return selectMany(selectStatement)
}