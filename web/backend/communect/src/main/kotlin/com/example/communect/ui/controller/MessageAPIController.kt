package com.example.communect.ui.controller

import com.example.communect.domain.model.Login
import com.example.communect.domain.model.MessageUpd
import com.example.communect.domain.service.MessageService
import com.example.communect.ui.form.MessageInfo
import com.example.communect.ui.form.MessageResponse
import com.example.communect.ui.form.UpdMessageRequest
import jakarta.servlet.http.HttpServletResponse
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

/** メッセージAPIコントローラ */
@RestController
@RequestMapping("/message")
class MessageAPIController(
    @Autowired val messageService: MessageService
) {
    /** メッセージ更新 */
    @PutMapping("/{messageId}")
    fun postMessage(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("messageId") messageId: String,
        @Validated @RequestBody req: UpdMessageRequest,
        bindingResult: BindingResult
    ): MessageResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updMessage = MessageUpd(messageId, req.message)

        val message = messageService.updMessage(updMessage, loginUser.user.userId)
        return MessageResponse(MessageInfo(message))
    }

    /** メッセージ削除 */
    @DeleteMapping("/{messageId}")
    fun deleteMessage(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("messageId") messageId: String
    ) {
        messageService.deleteMessage(messageId, loginUser.user.userId)
    }

    /** 連絡SSE登録 */
    @GetMapping("/sse", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun addSse(
        @AuthenticationPrincipal loginUser: Login,
        response: HttpServletResponse
    ): SseEmitter {
        response.setHeader("Cache-Control", "no-cache")
        response.setHeader("X-Accel-Buffering", "no")

        return messageService.addSse(loginUser.user.userId)
    }
}