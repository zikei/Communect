package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Contact
import com.example.communect.domain.repository.ContactRepository
import com.example.communect.infrastructure.db.mapper.ChoicecontactMapper
import com.example.communect.infrastructure.db.mapper.custom.CustomContactMapper
import com.example.communect.infrastructure.db.mapper.custom.selectByGroupIdAndContactId
import com.example.communect.infrastructure.db.mapper.select
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.record.Choicecontact as ChoicesRecord
import com.example.communect.infrastructure.db.mapper.ChoicecontactDynamicSqlSupport as ChoicesSql
import com.example.communect.infrastructure.db.record.custom.CustomContact as CustomContactRecord


/** 連絡リポジトリ実装クラス */
@Repository
class ContactRepositoryImpl(
    private val customContactMapper: CustomContactMapper,
    private val choiceContactMapper: ChoicecontactMapper,
    @Value("\${contactRowCount}") private val contactLimit: Long
) : ContactRepository {
    /**
     *  グループIDによる連絡取得
     *  @param groupId 検索グループID
     *  @param lastContactId 取得済み最古連絡ID(nullの場合最新のメッセージから取得)
     *  @return 連絡リスト
     */
    override fun findByGroupId(groupId: String, lastContactId: String?): List<Contact> {
        return customContactMapper.selectByGroupIdAndContactId(groupId, lastContactId, contactLimit).map{
            val choicesList = if(it.contacttype == ContactType.CHOICE){
                choiceContactMapper.select{
                    where { ChoicesSql.contactid isEqualTo it.contactid!! }
                }
            }else{
                null
            }
            toModel(it, choicesList)
        }
    }

    /** レコードのグループモデルへの変換 */
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

    /** レコードのグループモデルへの変換 */
    private fun toModel(record: ChoicesRecord): Choice {
        return Choice(
            record.choicecontactid!!,
            record.contactid!!,
            record.choices!!
        )
    }
}