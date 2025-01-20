package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Reaction
import com.example.communect.domain.model.ReactionIns
import com.example.communect.domain.repository.ReactionRepository
import com.example.communect.infrastructure.db.mapper.*
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport
import com.example.communect.infrastructure.db.mapper.custom.CustomReactionMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByContactId
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport as ReactionSql
import com.example.communect.infrastructure.db.record.Choicereaction as ChoiceReactionRecord
import com.example.communect.infrastructure.db.record.Reaction as ReactionRecord
import com.example.communect.infrastructure.db.record.custom.CustomReaction as CustomReactionRecord

/** リアクションリポジトリ実装クラス */
@Repository
class ReactionRepositoryImpl(
    private val customReactionMapper: CustomReactionMapper,
    private val reactionMapper: ReactionMapper,
    private val choiceReactionMapper: ChoicereactionMapper
) : ReactionRepository {
    /**
     *  連絡IDによるリアクションリスト取得
     *  @param contactId 連絡ID
     *  @return リアクションリスト
     */
    override fun findByContactId(contactId: String): List<Reaction> {
        return customReactionMapper.selectByContactId(contactId).map { toModel(it) }
    }

    /**
     *  連絡IDとユーザIDによるリアクション取得
     *  @param contactId 連絡ID
     *  @param userId ユーザID
     *  @return リアクションの存在判定 true: 存在
     */
    override fun isReactionByContactIdAndUserId(contactId: String, userId: String): Boolean {
        return reactionMapper.selectOne{
            where {
                ReactionSql.contactid isEqualTo contactId
                and {
                    ReactionSql.userid isEqualTo userId
                }
            }
        } != null
    }

    /**
     *  リアクションの追加
     *  @param reaction 追加リアクション
     */
    override fun insertReaction(reaction: ReactionIns) {
        val reactionRecord = toRecord(reaction)
        reactionMapper.insert(reactionRecord)
        reaction.choiceId?.let {
            choiceReactionMapper.insert(
                ChoiceReactionRecord(
                    UUID.randomUUID().toString(),
                    it
                )
            )
        }
    }

    /**
     *  連絡IDによるリアクションの削除
     *  @param contactId 連絡ID
     */
    override fun deleteByContactId(contactId: String) {
        reactionMapper.delete {
            where {
                ReactionSql.contactid isEqualTo contactId
            }
        }
    }


    /** レコードのリアクションモデルへの変換 */
    private fun toModel(record: CustomReactionRecord): Reaction {
        return Reaction(
            record.reactionid!!,
            record.contactid!!,
            record.reactiontime!!,
            record.choiceid?.let{
                Choice(
                    it,
                    record.contactid!!,
                    record.choices!!
                )
            },
            record.userid!!,
            record.username!!,
            if(record.groupnickname.isNullOrBlank()){
                record.nickname!!
            }else{
                record.groupnickname!!
            }
        )
    }

    /** リアクション追加モデルからレコードの変換 */
    private fun toRecord(model: ReactionIns): ReactionRecord {
        return ReactionRecord(
            UUID.randomUUID().toString(),
            model.contactId,
            model.userId,
            LocalDateTime.now()
        )
    }
}