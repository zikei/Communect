package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.model.TalkUpd
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.infrastructure.db.mapper.*
import org.springframework.stereotype.Repository
import java.util.UUID
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport as GroupTalkSql
import com.example.communect.infrastructure.db.mapper.IndividualTalkDynamicSqlSupport as IndividualTalkSql
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport as TalkSql
import com.example.communect.infrastructure.db.record.Talk as TalkRecord
import com.example.communect.infrastructure.db.record.GroupTalk as GroupTalkRecord
import com.example.communect.infrastructure.db.record.IndividualTalk as IndividualTalkRecord

/** トークリポジトリ実装クラス */
@Repository
class TalkRepositoryImpl(
    private val talkMapper: TalkMapper,
    private val groupTalkMapper: GroupTalkMapper,
    private val individualTalkMapper: IndividualTalkMapper
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

    /**
     *  個人トーク追加
     *  @param talk 追加個人トーク
     *  @return 追加トーク
     */
    override fun insertIndividualTalk(talk: IndividualTalkIns): Talk {
        val (talkRecord, individualTalkRecordList) = toRecord(talk)
        talkMapper.insert(talkRecord)
        individualTalkRecordList.map {
            individualTalkMapper.insert(it)
        }
        return toModel(talkRecord)
    }

    /**
     *  トーク更新
     *  @param talk 更新トーク
     */
    override fun updateTalk(talk: TalkUpd) {
        val record = toRecord(talk)
        talkMapper.updateByPrimaryKeySelective(record)
    }

    /**
     *  トーク削除
     *  @param talkId 削除対象トークID
     */
    override fun deleteByTalkId(talkId: String) {
        talkMapper.deleteByPrimaryKey(talkId)
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

    /** 個人トーク追加モデルからレコードの変換 */
    private fun toRecord(model: IndividualTalkIns): Pair<TalkRecord, List<IndividualTalkRecord>> {
        val talk = TalkRecord(
            UUID.randomUUID().toString(),
            model.talkName,
            TalkType.GROUP
        )
        val individualTalkList = model.userIds.map{userId ->
            IndividualTalkRecord(
                UUID.randomUUID().toString(),
                talk.talkid,
                userId
            )
        }
        return Pair(talk, individualTalkList)
    }

    /** トーク更新モデルからレコードの変換 */
    private fun toRecord(model: TalkUpd): TalkRecord {
        return TalkRecord(
            model.talkId,
            model.talkName,
            null
        )
    }
}