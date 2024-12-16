package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Talk
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.infrastructure.db.mapper.TalkMapper
import com.example.communect.infrastructure.db.mapper.select
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.mapper.TalkDynamicSqlSupport as TalkSql
import com.example.communect.infrastructure.db.mapper.GroupTalkDynamicSqlSupport as GroupTalkSql
import com.example.communect.infrastructure.db.record.Talk as TalkRecord

/** トークリポジトリ実装クラス */
@Repository
class TalkRepositoryImpl(
    private val talkMapper: TalkMapper
) : TalkRepository {
    /**
     *  グループトーク一覧取得
     *  @param groupId 検索対象グループID
     *  @return トークリスト
     */
    override fun findByGroupId(groupId: String): List<Talk> {
        return talkMapper.select {
            leftJoin(GroupTalkSql.groupTalk, "gt"){
                on(TalkSql.talkid) equalTo GroupTalkSql.talkid
            }
            where {
                GroupTalkSql.noticegroupid isEqualTo groupId
            }
        }.map { toModel(it) }
    }


    /** レコードのトークモデルへの変換 */
    private fun toModel(record: TalkRecord): Talk {
        return Talk(
            record.talkid!!,
            record.talktitle!!,
            record.talktype!!
        )
    }
}