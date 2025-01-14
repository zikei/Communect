package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.ContactIns
import com.example.communect.domain.model.ContactUpd
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.service.ContactService
import com.example.communect.domain.service.MessageService
import com.example.communect.ui.form.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.stereotype.Controller

/** websocketコントローラ */
@Controller
class WebSocketController(
    @Autowired val contactService: ContactService,
    @Autowired val messageService: MessageService
) {
    /** 連絡投稿 ウェブソケット */
    @MessageMapping("/contact/send")
    fun contactPostWS(
        @Payload req: ContactPostRequest
    ){
        val postContact = ContactIns(req.groupId, MockTestData.user1.userId, req.message, req.contactType, req.importance, req.choices)
        contactService.addContact(postContact)
    }

    /** 連絡更新 ウェブソケット */
    @MessageMapping("/contact/update")
    fun updContact(
        @Payload req: WSUpdContactRequest
    ){
        val updContact = ContactUpd(req.contactId, req.message, req.contactType, req.importance)
        contactService.updContact(updContact, req.choices)
    }

    /** 連絡削除 ウェブソケット */
    @MessageMapping("/contact/delete")
    fun deleteContact(
        @Payload req: WSDeleteContactRequest
    ) {
        contactService.deleteContact(req.contactId)
    }

    /** メッセージ送信 ウェブソケット */
    @MessageMapping("/message/send")
    fun postMessage(
        @Payload req: WSPostMessageRequest
    ) {
        val insMessage = MessageIns(req.message, req.talkId, MockTestData.user1.userId)
        messageService.postMessage(insMessage)
    }

    /** メッセージ更新 ウェブソケット */
    @MessageMapping("/message/update")
    fun postMessage(
        @Payload req: WSUpdMessageRequest
    ) {
        val updMessage = MessageUpd(req.messageId, req.message)
        messageService.updMessage(updMessage)
    }

    /** メッセージ削除 ウェブソケット */
    @MessageMapping("/message/delete")
    fun deleteMessage(
        @Payload req: WSDeleteMessageRequest
    ) {
        messageService.deleteMessage(req.messageId)
    }
}