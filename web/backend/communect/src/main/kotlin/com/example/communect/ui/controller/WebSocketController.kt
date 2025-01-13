package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.model.ContactUpd
import com.example.communect.domain.service.ContactService
import com.example.communect.ui.form.ContactPostRequest
import com.example.communect.ui.form.WSDeleteContactRequest
import com.example.communect.ui.form.WSUpdContactRequest
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.stereotype.Controller
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated

/** websocketコントローラ */
@Controller
class WebSocketController(
    @Autowired val contactService: ContactService
) {
    /** 連絡投稿 ウェブソケット */
    @MessageMapping("/contact/send")
    fun contactPostWS(
        @Validated @Payload req: ContactPostRequest,
        bindingResult: BindingResult
    ){
        if (bindingResult.hasErrors()) throw BadRequestException()

        val postContact = ContactIns(req.groupId, MockTestData.user1.userId, req.message, req.contactType, req.importance, req.choices)
        contactService.addContact(postContact)
    }

    /** 連絡更新 ウェブソケット */
    @MessageMapping("/contact/update")
    fun updContact(
        @Validated @Payload req: WSUpdContactRequest,
        bindingResult: BindingResult
    ){
        if (bindingResult.hasErrors()) throw BadRequestException()

        val updContact = ContactUpd(req.contactId, req.message, req.contactType, req.importance)
        contactService.updContact(updContact, req.choices)
    }

    /** 連絡削除 ウェブソケット */
    @MessageMapping("/contact/delete")
    fun deleteContact(
        @Validated @Payload req: WSDeleteContactRequest,
        bindingResult: BindingResult
    ) {
        contactService.deleteContact(req.contactId)
    }
}