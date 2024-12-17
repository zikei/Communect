package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.Message
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.repository.MessageRepository
import com.example.communect.infrastructure.db.mapper.MessageMapper
import com.example.communect.infrastructure.db.mapper.custom.CustomMessageMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByPrimaryKey
import com.example.communect.infrastructure.db.mapper.custom.selectByTalkIdAndMessageId
import com.example.communect.infrastructure.db.mapper.insert
import com.example.communect.infrastructure.db.mapper.updateByPrimaryKeySelective
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*
import com.example.communect.infrastructure.db.record.custom.CustomMessage as CustomMessageRecord
import com.example.communect.infrastructure.db.record.Message as MessageRecord


/** メッセージリポジトリ実装クラス */
@Repository
class MessageRepositoryImpl(
    private val customMessageMapper: CustomMessageMapper,
    private val messageMapper: MessageMapper,
    @Value("\${messageRowCount}") private val messageLimit: Long
) : MessageRepository {
    /**
     *  メッセージIDによるメッセージ取得
     *  @param messageId 検索メッセージID
     *  @return メッセージ
     */
    override fun findByMessageId(messageId: String): Message?{
        return customMessageMapper.selectByPrimaryKey(messageId)?.let { toModel(it) }
    }

    /**
     *  トークIDによるメッセージ取得
     *  @param talkId 検索トークID
     *  @param lastMessageId 取得済み最古メッセージID(nullの場合最新のメッセージから取得)
     *  @return メッセージリスト
     */
    override fun findByTalkId(talkId: String, lastMessageId: String?): List<Message> {
        return customMessageMapper.selectByTalkIdAndMessageId(talkId, lastMessageId, messageLimit).map{ toModel(it) }
    }

    /**
     *  メッセージ追加
     *  @param message 追加メッセージ
     *  @return 追加メッセージ
     */
    override fun insertMessage(message: MessageIns): Message? {
        val record = toRecord(message)
        messageMapper.insert(record)
        return record.messageid?.let { findByMessageId(it) }
    }

    /**
     *  メッセージ更新
     *  @param message 更新メッセージ
     *  @return 更新メッセージ
     */
    override fun updateMessage(message: MessageUpd) {
        val record = toRecord(message)
        messageMapper.updateByPrimaryKeySelective(record)
    }


    /** レコードのメッセージモデルへの変換 */
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

    /** メッセージ追加モデルからレコードの変換 */
    private fun toRecord(model: MessageIns): MessageRecord {
        return MessageRecord(
            UUID.randomUUID().toString(),
            model.talkId,
            model.userId,
            model.message,
            LocalDateTime.now()
        )
    }

    /** メッセージ更新モデルからレコードの変換 */
    private fun toRecord(model: MessageUpd): MessageRecord {
        return MessageRecord(
            model.messageId,
            null,
            null,
            model.message,
            null
        )
    }
}