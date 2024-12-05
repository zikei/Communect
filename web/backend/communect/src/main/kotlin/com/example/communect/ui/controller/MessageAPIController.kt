package com.example.communect.ui.controller

import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.service.MessageService
import com.example.communect.ui.form.MessageInfo
import com.example.communect.ui.form.MessageResponse
import com.example.communect.ui.form.UpdMessageRequest
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** メッセージAPIコントローラ */
@RestController
@RequestMapping("/message")
class MessageAPIController(
    @Autowired val messageService: MessageService
) {
    /** メッセージ更新 */
    @PutMapping("/{messageId}")
    fun postMessage(
        @PathVariable("messageId") messageId: String,
        @Validated @RequestBody req: UpdMessageRequest,
        bindingResult: BindingResult
    ): MessageResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updMessage = MessageUpd(messageId, req.message)

        val message = messageService.updMessage(updMessage)
        return MessageResponse(MessageInfo(message))
    }

    /** メッセージ削除 */
    @DeleteMapping("/{messageId}")
    fun deleteMessage(
        @PathVariable("messageId") messageId: String
    ) {
        messageService.deleteMessage(messageId)
    }
}