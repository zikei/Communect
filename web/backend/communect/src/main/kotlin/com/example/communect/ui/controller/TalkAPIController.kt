package com.example.communect.ui.controller

import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.Login
import com.example.communect.domain.model.MessageIns
import com.example.communect.domain.model.TalkUpd
import com.example.communect.domain.service.MessageService
import com.example.communect.domain.service.TalkService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** トークAPIコントローラ */
@RestController
@RequestMapping("/talk")
class TalkAPIController(
    @Autowired val talkService: TalkService,
    @Autowired val messageService: MessageService
) {
    /** 個人トーク一覧取得 */
    @GetMapping
    fun getIndividualTalks(
        @AuthenticationPrincipal loginUser: Login
    ): TalksResponse {
        val talks = talkService.getIndividualTalks(loginUser.user.userId)
        return TalksResponse(talks.map { TalkInfo(it) })
    }

    /** トーク取得 */
    @GetMapping("/{talkId}")
    fun getIndividualTalk(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("talkId") talkId: String
    ): TalkResponse {
        val talk = talkService.getTalk(talkId, loginUser.user.userId) ?: throw BadRequestException()
        return TalkResponse(TalkInfo(talk))
    }

    /** メッセージ一覧取得 */
    @GetMapping("/{talkId}/message")
    fun getIndividualTalk(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("talkId") talkId: String,
        messageId: String? = null
    ): MessagesResponse {
        if(!talkService.hasTalk(talkId, loginUser.user.userId)) throw BadRequestException()
        val messages = messageService.getMessages(talkId, messageId)
        return MessagesResponse(messages?.map { MessageInfo(it) })
    }

    /** 個人トーク追加 */
    @PostMapping
    fun addIndividualTalk(
        @AuthenticationPrincipal loginUser: Login,
        @Validated @RequestBody req: AddIndividualTalkRequest,
        bindingResult: BindingResult
    ): TalkResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insTalk = IndividualTalkIns(req.talkName, listOf(loginUser.user.userId, req.userId))

        val talk = talkService.addIndividualTalk(insTalk)
        return TalkResponse(TalkInfo(talk))
    }

    /** トーク更新 */
    @PutMapping("/{talkId}")
    fun updTalk(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("talkId") talkId: String,
        @Validated @RequestBody req: UpdTalkRequest,
        bindingResult: BindingResult
    ): TalkResponse {
        if(!talkService.hasTalk(talkId, loginUser.user.userId)) throw BadRequestException()
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updTalk = TalkUpd(talkId, req.talkName)

        val talk = talkService.updTalk(updTalk)
        return TalkResponse(TalkInfo(talk))
    }

    /** トーク削除 */
    @DeleteMapping("/{talkId}")
    fun deleteTalk(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("talkId") talkId: String
    ) {
        if(!talkService.hasTalk(talkId, loginUser.user.userId)) throw BadRequestException()
        talkService.deleteTalk(talkId)
    }

    /** メッセージ送信 */
    @PostMapping("/{talkId}/message")
    fun postMessage(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("talkId") talkId: String,
        @Validated @RequestBody req: PostMessageRequest,
        bindingResult: BindingResult
    ): MessageResponse {
        if(!talkService.hasTalk(talkId, loginUser.user.userId)) throw BadRequestException()
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insMessage = MessageIns(req.message, talkId, loginUser.user.userId)

        val message = messageService.postMessage(insMessage)
        return MessageResponse(MessageInfo(message))
    }
}