package com.example.communect.app.service

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.*
import com.example.communect.domain.repository.ContactRepository
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.domain.repository.ReactionRepository
import com.example.communect.domain.service.ContactService
import com.example.communect.domain.service.UserService
import com.example.communect.ui.form.ContactDeleteResponse
import com.example.communect.ui.form.ContactInfo
import com.example.communect.ui.form.ContactResponse
import org.apache.coyote.BadRequestException
import org.apache.ibatis.javassist.NotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.time.LocalDateTime
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/** 連絡処理実装クラス */
@Service
class ContactServiceImpl(
    @Autowired val contactRepository: ContactRepository,
    @Autowired val reactionRepository: ReactionRepository,
    @Autowired val groupUserRepository: GroupUserRepository,
    @Autowired val emitterRepository: ContactSseEmitterRepository
): ContactService {
    /**
     *  グループ連絡一覧取得
     *  @param groupId 検索グループID
     *  @param lastContactId 取得済み最古連絡ID
     *  @return 連絡リスト
     */
    override fun getContactsByGroupId(groupId: String, lastContactId: String?): List<Contact>? {
        return contactRepository.findByGroupId(groupId, lastContactId).takeIf { it.isNotEmpty() }
    }

    /**
     *  連絡取得
     *  @param contactId 検索連絡ID
     *  @return 連絡
     */
    override fun getContact(contactId: String): Contact? {
        return contactRepository.findByContactId(contactId)
    }

    /**
     *  連絡取得
     *  @param contactId 検索連絡ID
     *  @return リアクションリスト
     */
    override fun getReactions(contactId: String): List<Reaction> {
        return reactionRepository.findByContactId(contactId)
    }

    /**
     *  連絡投稿
     *  @param contact 投稿連絡情報
     *  @return 投稿連絡
     */
    override fun addContact(contact: ContactIns): Contact {
        val postContact = contactRepository.insertContact(contact) ?: throw BadRequestException()

        val groupUserIds = getGroupUserIds(contact.groupId)
        groupUserIds.forEach { id ->
            emitterRepository.send(id, "post", ContactResponse(ContactInfo(postContact)))
        }

        return postContact
    }

    /**
     *  連絡更新
     *  @param contact 更新連絡情報
     *  @return 投稿連絡
     */
    override fun updContact(contact: ContactUpd, choices: List<String>?): Contact {
        val index = MockTestData.contactList.indexOfFirst { it.contactId == contact.contactId }
        if(index == -1) throw BadRequestException()

        val contactType = contact.contactType ?: MockTestData.contactList[index].contactType
        val insChoices = if(contactType == ContactType.CHOICE){
            if(choices != null){
                MockTestData.reactionList.removeAll { it.contactId == contact.contactId }
                choices.map { Choice(UUID.randomUUID().toString(), MockTestData.contactList[index].groupId, it) }
            }else{
                MockTestData.contactList[index].choices ?: throw BadRequestException()
            }
        }else{
            null
        }
        val updContact =
            Contact(contact.contactId, MockTestData.contactList[index].groupId, MockTestData.contactList[index].userId,
                MockTestData.contactList[index].userName, MockTestData.contactList[index].nickName, MockTestData.contactList[index].groupName,
                contact.message ?: MockTestData.contactList[index].message, contactType,
                contact.importance ?: MockTestData.contactList[index].importance, MockTestData.contactList[index].createTime, insChoices)

        MockTestData.contactList[index] = updContact

        val groupUserIds = MockTestData.groupUserList.filter { it.groupId == updContact.groupId }.map { it.userId }
        groupUserIds.forEach { id ->
            emitterRepository.send(id, "update", ContactResponse(ContactInfo(updContact)))
        }

        return MockTestData.contactList[index]
    }

    /**
     *  連絡削除
     *  @param contactId 削除対象連絡ID
     */
    override fun deleteContact(contactId: String) {
        val groupId = MockTestData.contactList.find { it.contactId == contactId }?.groupId ?: throw BadRequestException()
        MockTestData.contactList.removeAll { it.contactId == contactId }
        MockTestData.reactionList.removeAll { it.contactId == contactId }

        val groupUserIds = MockTestData.groupUserList.filter { it.groupId == groupId }.map { it.userId }
        groupUserIds.forEach { id ->
            emitterRepository.send(id, "delete", ContactDeleteResponse(contactId))
        }
    }

    /**
     *  リアクション
     *  @param reaction 追加リアクション情報
     */
    override fun addReaction(reaction: ReactionIns) {
        val contact = MockTestData.contactList.find { it.contactId == reaction.contactId } ?: throw BadRequestException()
        val user = MockTestData.userList.find { it.userId == reaction.userId } ?: throw BadRequestException()
        val insChoice = if(contact.contactType == ContactType.CHOICE){
            reaction.choiceId?.let { contact.choices?.find { choice -> choice.choiceId == it } } ?: throw BadRequestException()
        }else{
            null
        }
        MockTestData.reactionList.add(Reaction(UUID.randomUUID().toString(), reaction.contactId, LocalDateTime.now(), insChoice, reaction.userId, user.userName, user.nickName))
    }

    /**
     * SSE登録
     * @param userId SSE登録ユーザID
     */
    override fun addSse(userId: String): SseEmitter {
        return emitterRepository.addEmitter(userId)
    }

    /** グループに所属するユーザIDリストを取得 */
    private fun getGroupUserIds(groupId: String): List<String>{
        return groupUserRepository.findByGroupId(groupId).map { it.userId }
    }
}

@Component
class ContactSseEmitterRepository(
    @Value("\${sseTimeOutMinutes}") private val sseTimeOutMinutes: Long
) {
    private val emitters = ConcurrentHashMap<String, MutableSet<SseEmitter>>()

    fun addEmitter(userId: String): SseEmitter {
        val emitter = SseEmitter(sseTimeOutMinutes * 60 * 1000)
        emitter.onCompletion {
            removeEmitter(userId, emitter)
        }
        emitter.onTimeout{
            removeEmitter(userId, emitter)
        }

        synchronized(this) {
            emitters.computeIfAbsent(userId) { mutableSetOf() }.add(emitter)
        }

        emitter.send(
            SseEmitter.event()
                .name("connection")
                .data("contact: Connection established successfully")
        )

        return emitter
    }

    fun removeEmitter(userId: String, emitter: SseEmitter) {
        synchronized(this) {
            emitters[userId]?.let { emitterSet ->
                emitterSet.remove(emitter)
                if (emitterSet.isEmpty()) {
                    emitters.remove(userId)
                }
            }
        }

        try {
            emitter.send(
                SseEmitter.event()
                    .name("disconnect")
                    .data("contact: Connection closed")
            )
        } catch (_: Exception) { }
    }

    fun send(userId: String, name: String, data: Any){
        emitters[userId]?.forEach { emitter ->
            try {
                emitter.send(
                    SseEmitter.event()
                        .name(name)
                        .data(data)
                )
            }catch (e: Exception){
                removeEmitter(userId, emitter)
            }
        }
    }
}