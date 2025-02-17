package com.example.communect.ui.controller

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.model.ContactUpd
import com.example.communect.domain.model.Login
import com.example.communect.domain.model.ReactionIns
import com.example.communect.domain.service.ContactService
import com.example.communect.domain.service.GroupService
import com.example.communect.ui.form.*
import jakarta.servlet.http.HttpServletResponse
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

/** 連絡APIコントローラ */
@RestController
@RequestMapping("/contact")
class ContactAPIController(
    @Autowired val contactService: ContactService,
    @Autowired val groupService: GroupService
) {
    /** 連絡詳細取得 */
    @GetMapping("/{contactId}")
    fun getContact(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("contactId") contactId: String
    ): ContactAndReactionsResponse {
        if(!contactService.hasGroupByContactId(contactId, loginUser.user.userId)) throw BadRequestException()
        val contact = contactService.getContact(contactId) ?: throw BadRequestException()
        val reactions = if(contact.contactType == ContactType.INFORM){
            null
        }else{
            contactService.getReactions(contactId)
        }
        return ContactAndReactionsResponse(ContactInfo(contact), reactions?.map { ReactionInfo(it) })
    }

    /** 連絡投稿 */
    @PostMapping
    fun contactPost(
        @AuthenticationPrincipal loginUser: Login,
        @Validated @RequestBody req: ContactPostRequest,
        bindingResult: BindingResult
    ): ContactResponse {
        if(!groupService.hasGroupByGroupId(req.groupId, loginUser.user.userId)) throw BadRequestException()
        if (bindingResult.hasErrors()) throw BadRequestException()

        val postContact = ContactIns(req.groupId, loginUser.user.userId, req.message, req.contactType, req.importance, req.choices)
        val contact = contactService.addContact(postContact)
        return ContactResponse(ContactInfo(contact))
    }

    /** 連絡更新 */
    @PutMapping("/{contactId}")
    fun updContact(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("contactId") contactId: String,
        @Validated @RequestBody req: UpdContactRequest,
        bindingResult: BindingResult
    ): ContactResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()

        val updContact = ContactUpd(contactId, req.message, req.contactType, req.importance)
        val contact = contactService.updContact(updContact, req.choices, loginUser.user.userId)
        return ContactResponse(ContactInfo(contact))
    }

    /** 連絡削除 */
    @DeleteMapping("/{contactId}")
    fun deleteContact(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("contactId") contactId: String
    ) {
        contactService.deleteContact(contactId, loginUser.user.userId)
    }

    /** リアクション */
    @PostMapping("/{contactId}/reaction")
    fun addReaction(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("contactId") contactId: String,
        @RequestBody req: AddReactionRequest
    ) {
        if(!contactService.hasGroupByContactId(contactId, loginUser.user.userId)) throw BadRequestException()
        contactService.addReaction(ReactionIns(contactId, req.choiceId, loginUser.user.userId))
    }

    /** 連絡SSE登録 */
    @GetMapping("/sse", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun addSse(
        @AuthenticationPrincipal loginUser: Login,
        response: HttpServletResponse
    ): SseEmitter{
        response.setHeader("Cache-Control", "no-cache")
        response.setHeader("X-Accel-Buffering", "no")

        return contactService.addSse(loginUser.user.userId)
    }
}