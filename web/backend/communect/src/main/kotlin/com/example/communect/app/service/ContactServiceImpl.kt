package com.example.communect.app.service

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.*
import com.example.communect.domain.repository.ContactRepository
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.domain.repository.ReactionRepository
import com.example.communect.domain.service.ContactService
import com.example.communect.ui.form.ContactDeleteResponse
import com.example.communect.ui.form.ContactInfo
import com.example.communect.ui.form.ContactResponse
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ConcurrentHashMap

/** 連絡処理実装クラス */
@Service
class ContactServiceImpl(
    @Autowired val contactRepository: ContactRepository,
    @Autowired val reactionRepository: ReactionRepository,
    @Autowired val groupUserRepository: GroupUserRepository,
    @Autowired val emitterRepository: ContactSseEmitterRepository,
    @Value("\${choiceMinCount}") private val choiceMinCount: Int
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
        if(contact.contactType == ContactType.CHOICE && (contact.choices?.size ?: 0) < choiceMinCount) throw BadRequestException()
        val groupUser = groupUserRepository.findByGroupIdAndUserId(contact.groupId, contact.userId) ?: throw BadRequestException()
        if (groupUser.role.weight < contact.importance.weight) throw BadRequestException()

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
    override fun updContact(contact: ContactUpd, choices: List<String>?, loginUserId: String): Contact {
        val oldContact = contactRepository.findByContactId(contact.contactId) ?: throw BadRequestException()
        if (oldContact.userId != loginUserId) throw BadRequestException()

        if(!(contact.contactType == null && contact.importance == null && contact.message == null)){
            contactRepository.updateContact(contact)
        }

        if (oldContact.contactType != contact.contactType) reactionRepository.deleteByContactId(contact.contactId)
        if (choices != null) {
            if(!((oldContact.contactType == ContactType.CHOICE && contact.contactType == null) || contact.contactType == ContactType.CHOICE)) throw BadRequestException()
            if (choices.size < choiceMinCount) throw BadRequestException()
            if (oldContact.contactType == ContactType.CHOICE) {
                contactRepository.deleteChoicesByContactId(contact.contactId)
            }
            contactRepository.insertChoices(choices.map { ChoiceIns(contact.contactId, it) })
        }else if(contact.contactType == ContactType.CHOICE && oldContact.contactType != ContactType.CHOICE){
            throw BadRequestException()
        }else if(oldContact.contactType == ContactType.CHOICE){
            contactRepository.deleteChoicesByContactId(contact.contactId)
        }

        val updContact = contactRepository.findByContactId(contact.contactId) ?: throw BadRequestException()

        val groupUserIds = getGroupUserIds(oldContact.groupId)
        groupUserIds.forEach { id ->
            emitterRepository.send(id, "update", ContactResponse(ContactInfo(updContact)))
        }

        return updContact
    }

    /**
     *  連絡削除
     *  @param contactId 削除対象連絡ID
     */
    override fun deleteContact(contactId: String, loginUserId: String) {
        val oldContact = contactRepository.findByContactId(contactId) ?: throw BadRequestException()
        if(oldContact.userId != loginUserId) throw BadRequestException()

        contactRepository.deleteByContactId(contactId)

        val groupUserIds = getGroupUserIds(oldContact.groupId)
        groupUserIds.forEach { id ->
            emitterRepository.send(id, "delete", ContactDeleteResponse(contactId))
        }
    }

    /**
     *  リアクション
     *  @param reaction 追加リアクション情報
     */
    override fun addReaction(reaction: ReactionIns) {
        if(reactionRepository.isReactionByContactIdAndUserId(reaction.contactId, reaction.userId)) throw BadRequestException()
        val contact = contactRepository.findByContactId(reaction.contactId) ?: throw BadRequestException()

        if(contact.contactType == ContactType.CHOICE){
            reaction.choiceId ?: throw BadRequestException()
            contact.choices?.find { it.choiceId == reaction.choiceId} ?: throw BadRequestException()
        }else if(contact.contactType == ContactType.INFORM || reaction.choiceId != null){
            throw BadRequestException()
        }

        reactionRepository.insertReaction(reaction)
    }

    /**
     * SSE登録
     * @param userId SSE登録ユーザID
     */
    override fun addSse(userId: String): SseEmitter {
        return emitterRepository.addEmitter(userId)
    }

    /**
     * グループ所属確認
     * @param contactId 連絡ID
     * @param loginUserId 所属確認ユーザID
     * @return true: 所属 false: 未所属
     */
    override fun hasGroupByContactId(contactId: String, loginUserId: String): Boolean {
        val contact = contactRepository.findByContactId(contactId) ?: return false
        return groupUserRepository.findByGroupIdAndUserId(contact.groupId, loginUserId) != null
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
        val userEmitters = synchronized(this) { emitters[userId]?.toSet() } ?: return

        userEmitters.forEach {
            try {
                it.send(
                    SseEmitter.event()
                        .name(name)
                        .data(data)
                )
            } catch (e: Exception) {
                synchronized(this) {
                    removeEmitter(userId, it)
                }
            }
        }
    }
}