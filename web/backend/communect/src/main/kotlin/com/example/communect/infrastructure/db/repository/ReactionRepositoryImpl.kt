package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Reaction
import com.example.communect.domain.repository.ReactionRepository
import com.example.communect.infrastructure.db.mapper.ReactionMapper
import com.example.communect.infrastructure.db.mapper.custom.CustomReactionMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByContactId
import com.example.communect.infrastructure.db.mapper.delete
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.mapper.ReactionDynamicSqlSupport as ReactionSql
import com.example.communect.infrastructure.db.record.custom.CustomReaction as CustomReactionRecord

/** リアクションリポジトリ実装クラス */
@Repository
class ReactionRepositoryImpl(
    private val customReactionMapper: CustomReactionMapper,
    private val reactionMapper: ReactionMapper
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
}