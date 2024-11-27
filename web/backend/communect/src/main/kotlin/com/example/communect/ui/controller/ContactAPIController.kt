package com.example.communect.ui.controller

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.model.ContactUpd
import com.example.communect.domain.service.ContactService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** 連絡APIコントローラ */
@RestController
@RequestMapping("/contact")
class ContactAPIController(
    @Autowired val contactService: ContactService
) {
    /** 連絡詳細取得 */
    @GetMapping("/{contactId}")
    fun getContact(
        @PathVariable("contactId") contactId: String
    ): ContactAndReactionsResponse {
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
        @Validated @RequestBody req: ContactPostRequest,
        bindingResult: BindingResult
    ): ContactResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()

        val postContact = ContactIns(req.groupId, req.message, req.contactType, req.importance, req.choices)
        val contact = contactService.addContact(postContact)
        return ContactResponse(ContactInfo(contact))
    }

    /** 連絡投稿 */
    @PutMapping("/{contactId}")
    fun updContact(
        @PathVariable("contactId") contactId: String,
        @Validated @RequestBody req: UpdContactRequest,
        bindingResult: BindingResult
    ): ContactResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()

        val updContact = ContactUpd(contactId, req.message, req.contactType, req.importance, req.choices)
        val contact = contactService.updContact(updContact)
        return ContactResponse(ContactInfo(contact))
    }
}