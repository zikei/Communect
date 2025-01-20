package com.example.communect.infrastructure.db.mapper.custom

import com.example.communect.infrastructure.db.record.custom.CustomReaction
import org.apache.ibatis.annotations.*
import org.apache.ibatis.type.JdbcType
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider
import org.mybatis.dynamic.sql.util.SqlProviderAdapter
import org.mybatis.dynamic.sql.util.kotlin.mybatis3.select
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport as Reaction
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport.reaction as reactionTable
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport as Contact
import com.example.communect.infrastructure.db.mapper.ContactDynamicSqlSupport.contact as contactTable
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport as Choice
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport.choicecontact as choiceTable
import com.example.communect.infrastructure.db.mapper.ChoicereactionDynamicSqlSupport as ChoiceReaction
import com.example.communect.infrastructure.db.mapper.ChoicereactionDynamicSqlSupport.choicereaction as choiceReactionTable
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as User
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport.user as userTable
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport as UserGroup
import com.example.communect.infrastructure.db.mapper.UserGroupDynamicSqlSupport.userGroup as userGroupTable

@Mapper
interface CustomReactionMapper {
    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @Results(
        id = "CustomReactionRecordResult", value = [
            Result(column="reactionId", property="reactionid", jdbcType=JdbcType.CHAR, id=true),
            Result(column="contactId", property="contactid", jdbcType=JdbcType.CHAR),
            Result(column="reactionTime", property="reactiontime", jdbcType=JdbcType.TIMESTAMP),
            Result(column="choiceContactId", property="choiceid", jdbcType=JdbcType.CHAR),
            Result(column="choices", property="choices", jdbcType=JdbcType.VARCHAR),
            Result(column="userId", property="userid", jdbcType=JdbcType.CHAR),
            Result(column="userName", property="username", jdbcType=JdbcType.VARCHAR),
            Result(column="nickname", property="nickname", jdbcType=JdbcType.VARCHAR),
            Result(column="groupNickname", property="groupnickname", jdbcType=JdbcType.VARCHAR)
        ]
    )
    fun selectMany(selectStatement: SelectStatementProvider) : List<CustomReaction>

    @SelectProvider(type = SqlProviderAdapter::class, method = "select")
    @ResultMap("CustomReactionRecordResult")
    fun selectOne(selectStatement: SelectStatementProvider) : CustomReaction?
}

private val columnList = listOf(
    Reaction.reactionid,
    Reaction.contactid,
    Reaction.reactiontime,
    ChoiceReaction.choicecontactid,
    Choice.choices,
    Reaction.userid,
    User.username,
    User.nickname,
    UserGroup.nickname.`as`("groupNickname")
)

fun CustomReactionMapper.selectByContactId(contactId: String): List<CustomReaction> {
    val selectStatement = select(columnList){
        from(reactionTable, "r")
        leftJoin(contactTable, "c"){
            on(Reaction.contactid) equalTo Contact.contactid
        }
        leftJoin(userTable, "u"){
            on(Reaction.userid) equalTo User.userid
        }
        leftJoin(userGroupTable, "ug"){
            on(Reaction.userid) equalTo UserGroup.userid
            and(Contact.noticegroupid) equalTo UserGroup.noticegroupid
        }
        leftJoin(choiceReactionTable, "cr"){
            on(Reaction.reactionid) equalTo ChoiceReaction.reactionid
        }
        leftJoin(choiceTable, "ch"){
            on(ChoiceReaction.choicecontactid) equalTo Choice.choicecontactid
        }
        where {
            Reaction.contactid isEqualTo contactId
        }
    }
    return selectMany(selectStatement)
}