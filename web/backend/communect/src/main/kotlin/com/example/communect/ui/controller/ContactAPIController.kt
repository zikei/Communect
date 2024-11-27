package com.example.communect.ui.controller

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.service.ContactService
import com.example.communect.ui.form.ContactInfo
import com.example.communect.ui.form.ContactResponse
import com.example.communect.ui.form.ReactionInfo
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/** 連絡APIコントローラ */
@RestController
@RequestMapping("/contact")
class ContactAPIController(
    @Autowired val contactService: ContactService
) {
    /** 連絡詳細取得 */
    @GetMapping("/{contactId}")
    fun getGroup(
        @PathVariable("contactId") contactId: String
    ): ContactResponse {
        val contact = contactService.getContact(contactId) ?: throw BadRequestException()
        val reactions = if(contact.contactType == ContactType.INFORM){
            null
        }else{
            contactService.getReactions(contactId)
        }
        return ContactResponse(ContactInfo(contact), reactions?.map { ReactionInfo(it) })
    }
}