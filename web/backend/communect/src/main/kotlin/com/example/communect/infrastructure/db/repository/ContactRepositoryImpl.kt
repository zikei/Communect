package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Contact
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.repository.ContactRepository
import com.example.communect.infrastructure.db.mapper.ChoicecontactMapper
import com.example.communect.infrastructure.db.mapper.ContactMapper
import com.example.communect.infrastructure.db.mapper.custom.CustomContactMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupIdAndContactId
import com.example.communect.infrastructure.db.mapper.custom.selectByPrimaryKey
import com.example.communect.infrastructure.db.mapper.insert
import com.example.communect.infrastructure.db.mapper.select
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport as ChoicesSql
import com.example.communect.infrastructure.db.record.Choicecontact as ChoicesRecord
import com.example.communect.infrastructure.db.record.Contact as ContactRecord
import com.example.communect.infrastructure.db.record.custom.CustomContact as CustomContactRecord


/** 連絡リポジトリ実装クラス */
@Repository
class ContactRepositoryImpl(
    private val customContactMapper: CustomContactMapper,
    private val contactMapper: ContactMapper,
    private val choiceContactMapper: ChoicecontactMapper,
    @Value("\${contactRowCount}") private val contactLimit: Long
) : ContactRepository {
    /**
     *  連絡IDによる連絡取得
     *  @param contactId 連絡ID
     *  @return 連絡
     */
    override fun findByContactId(contactId: String): Contact? {
        return customContactMapper.selectByPrimaryKey(contactId)?.let { toModelAndFindChoices(it) }
    }

    /**
     *  グループIDによる連絡取得
     *  @param groupId 検索グループID
     *  @param lastContactId 取得済み最古連絡ID(nullの場合最新のメッセージから取得)
     *  @return 連絡リスト
     */
    override fun findByGroupId(groupId: String, lastContactId: String?): List<Contact> {
        return customContactMapper.selectByGroupIdAndContactId(groupId, lastContactId, contactLimit).map{
            toModelAndFindChoices(it)
        }
    }

    /**
     *  連絡追加
     *  @param contact 追加連絡情報
     *  @return 追加連絡
     */
    override fun insertContact(contact: ContactIns): Contact? {
        val (contactRecord, choiceRecordList) = toRecord(contact)
        contactMapper.insert(contactRecord)
        choiceRecordList?.map {
            choiceContactMapper.insert(it)
        }
        return contactRecord.contactid?.let { findByContactId(it) }
    }


    /**
     * レコードの連絡モデルへの変換
     * 多肢連絡の場合はDBから選択肢も取得する
     */
    private fun toModelAndFindChoices(record: CustomContactRecord): Contact {
        val choicesList = if(record.contacttype == ContactType.CHOICE){
            choiceContactMapper.select{
                where { ChoicesSql.contactid isEqualTo record.contactid!! }
            }
        }else{
            null
        }
        return toModel(record, choicesList)
    }

    /** レコードの連絡モデルへの変換 */
    private fun toModel(record: CustomContactRecord, choicesRecordList: List<ChoicesRecord>?): Contact {
        return Contact(
            record.contactid!!,
            record.groupid!!,
            record.userid!!,
            record.username!!,
            if(record.groupnickname.isNullOrBlank()){
                record.nickname!!
            }else{
                record.groupnickname!!
            },
            record.groupname!!,
            record.message!!,
            record.contacttype!!,
            record.importance!!,
            record.createtime!!,
            choicesRecordList?.map { toModel(it) }
        )
    }

    /** レコードの選択肢モデルへの変換 */
    private fun toModel(record: ChoicesRecord): Choice {
        return Choice(
            record.choicecontactid!!,
            record.contactid!!,
            record.choices!!
        )
    }

    /** 連絡追加モデルからレコードの変換 */
    private fun toRecord(model: ContactIns): Pair<ContactRecord, List<ChoicesRecord>?> {
        val contactRecord = ContactRecord(
            UUID.randomUUID().toString(),
            model.groupId,
            model.userId,
            model.message,
            model.contactType,
            model.importance,
            LocalDateTime.now()
        )
        val choiceRecordList = model.choices?.map {choice ->
            ChoicesRecord(
                UUID.randomUUID().toString(),
                contactRecord.contactid,
                choice
            )
        }
        return Pair(contactRecord, choiceRecordList)
    }
}