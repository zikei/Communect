package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Message
import com.example.communect.domain.repository.MessageRepository
import com.example.communect.infrastructure.db.mapper.custom.CustomMessageMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByTalkIdAndMessageId
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.record.custom.CustomMessage as CustomMessageRecord


/** メッセージリポジトリ実装クラス */
@Repository
class MessageRepositoryImpl(
    private val customMessageMapper: CustomMessageMapper,
    @Value("\${messageRowCount}") private val messageLimit: Long
) : MessageRepository {
    /**
     *  トークIDによるメッセージ取得
     *  @param talkId 検索トークID
     *  @param lastMessageId 取得済み最古メッセージID(nullの場合最新のメッセージから取得)
     *  @return 連絡リスト
     */
    override fun findByTalkId(talkId: String, lastMessageId: String?): List<Message> {
        return customMessageMapper.selectByTalkIdAndMessageId(talkId, lastMessageId, messageLimit).map{
            toModel(it)
        }
    }

    /** レコードの選択肢モデルへの変換 */
    private fun toModel(record: CustomMessageRecord): Message {
        return Message(
            record.messageid!!,
            record.message!!,
            record.createtime!!,
            record.talkid!!,
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