package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.service.ContactService
import com.example.communect.ui.form.ContactPostRequest
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
}