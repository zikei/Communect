package com.example.communect.app.service

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.Choice
import com.example.communect.domain.model.Contact
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.model.Reaction
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

    override fun addContact(contact: ContactIns): Contact {
        if(contact.contactType == ContactType.CHOICE && contact.choices == null) throw BadRequestException()
        val group = MockTestData.groupList.find { it.groupId == contact.groupId } ?: throw BadRequestException()

        val contactId = UUID.randomUUID().toString()
        val postChoices = contact.choices?.map { Choice(UUID.randomUUID().toString(), contactId, it) }
        val postContact = Contact(contactId, contact.groupId, group.groupName, contact.message, contact.contactType, contact.importance, LocalDateTime.now(), postChoices)
        MockTestData.contactList.add(postContact)

        return postContact
    }
}