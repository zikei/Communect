package com.example.communect.app.service

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.*
import com.example.communect.domain.service.ContactService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

/** 連絡処理実装クラス */
@Service
class ContactServiceImpl(
    @Value("\${contactRowCount}") private val contactLimit: Int
): ContactService {
    /**
     *  グループ連絡一覧取得
     *  @param groupId 検索グループID
     *  @param lastContactId 取得済み最古連絡ID
     *  @return 連絡リスト
     */
    override fun getContactsByGroupId(groupId: String, lastContactId: String?): List<Contact> {
        val contact = lastContactId?.let {id -> MockTestData.contactList.find { it.contactId ==  id} }
        val contacts = MockTestData.contactList.filter {
            it.groupId == groupId && ( contact == null || it.createTime.isBefore(contact.createTime) )
        }.sortedBy { it.createTime }
        return contacts.take(contactLimit).sortedByDescending { it.createTime }
    }

    /**
     *  連絡取得
     *  @param contactId 検索連絡ID
     *  @return 連絡
     */
    override fun getContact(contactId: String): Contact? {
        return MockTestData.contactList.find { it.contactId == contactId }
    }

    /**
     *  連絡取得
     *  @param contactId 検索連絡ID
     *  @return リアクションリスト
     */
    override fun getReactions(contactId: String): List<Reaction> {
        return MockTestData.reactionList.filter { it.contactId == contactId }
    }

    /**
     *  連絡投稿
     *  @param contact 投稿連絡情報
     *  @return 投稿連絡
     */
    override fun addContact(contact: ContactIns): Contact {
        if(contact.contactType == ContactType.CHOICE && contact.choices == null) throw BadRequestException()
        val group = MockTestData.groupList.find { it.groupId == contact.groupId } ?: throw BadRequestException()

        val contactId = UUID.randomUUID().toString()
        val postChoices = contact.choices?.map { Choice(UUID.randomUUID().toString(), contactId, it) }
        val postContact = Contact(contactId, contact.groupId, group.groupName, contact.message, contact.contactType, contact.importance, LocalDateTime.now(), postChoices)
        MockTestData.contactList.add(postContact)

        return postContact
    }

    /**
     *  連絡更新
     *  @param contact 更新連絡情報
     *  @return 投稿連絡
     */
    override fun updContact(contact: ContactUpd): Contact {
        val index = MockTestData.contactList.indexOfFirst { it.contactId == contact.contactId }
        if(index == -1) throw BadRequestException()

        val contactType = contact.contactType ?: MockTestData.contactList[index].contactType
        val choices = if(contactType == ContactType.CHOICE){
            if(contact.choices != null){
                MockTestData.reactionList.removeAll { it.contactId == contact.contactId }
                contact.choices.map { Choice(UUID.randomUUID().toString(), MockTestData.contactList[index].groupId, it) }
            }else{
                MockTestData.contactList[index].choices ?: throw BadRequestException()
            }
        }else{
            null
        }
        val updContact =
            Contact(contact.contactId, MockTestData.contactList[index].groupId, MockTestData.contactList[index].groupName,
                contact.message ?: MockTestData.contactList[index].message, contactType,
                contact.importance ?: MockTestData.contactList[index].importance, MockTestData.contactList[index].createTime, choices)

        MockTestData.contactList[index] = updContact
        return MockTestData.contactList[index]
    }
}