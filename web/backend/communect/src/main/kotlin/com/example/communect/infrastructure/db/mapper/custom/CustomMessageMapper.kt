package com.example.communect.infrastructure.db.mapper.custom

import com.example.communect.infrastructure.db.record.custom.CustomMessage
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.select
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport as GroupTalk
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport.groupTalk as groupTalkTable
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport as Message
import com.example.communect.infrastructure.db.mapper.MessageDynamicSqlSupport.message as messageTable
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as User
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.user as userTable
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroup
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userGroup as userGroupTable

@Mapper
interface CustomMessageMapper {
    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @Results(
        id = "CustomMessageRecordResult", value = [
            Result(column="messageId", property="messageid", jdbcType=JdbcType.CHAR, id=true),
            Result(column="message", property="message", jdbcType=JdbcType.VARCHAR),
            Result(column="createTime", property="createtime", jdbcType=JdbcType.TIMESTAMP),
            Result(column="talkId", property="talkid", jdbcType=JdbcType.CHAR),
            Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
            Result(column="userName", property="username", jdbcType=JdbcType.VARCHAR),
            Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
            Result(column="groupNickname", property="groupnickname", jdbcType=JdbcType.VARCHAR)
        ]
    )
    fun selectMany(selectStatement: SelectStatementProvider) : List<CustomMessage>

    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @ResultMap("CustomMessageRecordResult")
    fun selectOne(selectStatement: SelectStatementProvider) : CustomMessage?
}

private val columnList = listOf(
    Message.messageid,
    Message.message.message,
    Message.createtime,
    Message.talkid,
    Message.userid,
    User.username,
    User.nickname,
    UserGroup.nickname.`as`("groupNickname")
)

fun CustomMessageMapper.selectByPrimaryKey(messageId: String): CustomMessage? {
    val selectStatement = select(columnList){
        from(messageTable, "m")
        leftJoin(userTable, "u"){
            on(Message.userid) equalTo(User.userid)
        }
        leftJoin(groupTalkTable, "gt"){
            on(Message.talkid) equalTo(GroupTalk.talkid)
        }
        leftJoin(userGroupTable, "ug"){
            on(Message.userid) equalTo (UserGroup.userid)
            and(GroupTalk.noticegroupid) equalTo(UserGroup.noticegroupid)
        }
        where {
            Message.messageid isEqualTo messageId
        }
    }
    return selectOne(selectStatement)
}

fun CustomMessageMapper.selectByTalkIdAndMessageId(talkId: String, lastMessageId: String?, readLimit: Long?): List<CustomMessage> {
    val selectStatement = select(columnList){
        from(messageTable, "m")
        leftJoin(userTable, "u"){
            on(Message.userid) equalTo(User.userid)
        }
        leftJoin(groupTalkTable, "gt"){
            on(Message.talkid) equalTo(GroupTalk.talkid)
        }
        leftJoin(userGroupTable, "ug"){
            on(Message.userid) equalTo (UserGroup.userid)
            and(GroupTalk.noticegroupid) equalTo(UserGroup.noticegroupid)
        }
        where {
            Message.talkid isEqualTo talkId
            lastMessageId?.let {messageId ->
                and{
                    Message.createtime isLessThan  {
                        select(Message.createtime){
                            from(messageTable, "m2")
                            where {
                                Message.messageid isEqualTo messageId
                            }
                        }
                    }
                }
            }
        }
        orderBy(Message.createtime.descending())
        readLimit?.let { limit(readLimit) }
    }
    return selectMany(selectStatement)
}