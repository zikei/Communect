package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.infrastructure.db.mapper.*
import org.springframework.stereotype.Repository
import java.util.UUID
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport as GroupTalkSql
import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport as IndividualTalkSql
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport as TalkSql
import com.example.communect.infrastructure.db.record.Talk as TalkRecord
import com.example.communect.infrastructure.db.record.GroupTalk as GroupTalkRecord

/** トークリポジトリ実装クラス */
@Repository
class TalkRepositoryImpl(
    private val talkMapper: TalkMapper,
    private val groupTalkMapper: GroupTalkMapper
) : TalkRepository {
    /**
     *  トーク取得
     *  @param talkId 検索対象トークID
     *  @return トーク
     */
    override fun findByTalkId(talkId: String): Talk? {
        return talkMapper.selectOne{
            where {
                TalkSql.talkid isEqualTo talkId
            }
        }?.let { toModel(it) }
    }

    /**
     *  グループトーク一覧取得
     *  @param groupId 検索対象グループID
     *  @return トークリスト
     */
    override fun findGroupTalkByGroupId(groupId: String): List<Talk> {
        return talkMapper.select {
            leftJoin(GroupTalkSql.groupTalk, "gt"){
                on(TalkSql.talkid) equalTo GroupTalkSql.talkid
            }
            where {
                GroupTalkSql.noticegroupid isEqualTo groupId
            }
        }.map { toModel(it) }
    }

    /**
     *  個人トーク一覧取得
     *  @param userId 検索対象ユーザID
     *  @return トークリスト
     */
    override fun findIndividualTalkByUserId(userId: String): List<Talk> {
        return talkMapper.select {
            leftJoin(IndividualTalkSql.individualTalk, "it"){
                on(TalkSql.talkid) equalTo IndividualTalkSql.talkid
            }
            where {
                IndividualTalkSql.userid isEqualTo userId
            }
        }.map { toModel(it) }
    }

    /**
     *  グループトーク追加
     *  @param talk 追加グループトーク
     *  @return 追加トーク
     */
    override fun insertGroupTalk(talk: GroupTalkIns): Talk {
        val (talkRecord, groupTalkRecord) = toRecord(talk)
        talkMapper.insert(talkRecord)
        groupTalkMapper.insert(groupTalkRecord)
        return toModel(talkRecord)
    }


    /** レコードのトークモデルへの変換 */
    private fun toModel(record: TalkRecord): Talk {
        return Talk(
            record.talkid!!,
            record.talktitle!!,
            record.talktype!!
        )
    }

    /** グループトーク追加モデルからレコードの変換 */
    private fun toRecord(model: GroupTalkIns): Pair<TalkRecord, GroupTalkRecord> {
        val talk = TalkRecord(
            UUID.randomUUID().toString(),
            model.talkName,
            TalkType.GROUP
        )
        val groupTalk = GroupTalkRecord(
            talk.talkid,
            model.groupId
        )
        return Pair(talk, groupTalk)
    }
}