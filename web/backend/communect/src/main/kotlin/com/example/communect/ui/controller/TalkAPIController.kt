package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.TalkUpd
import com.example.communect.domain.service.TalkService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** トークAPIコントローラ */
@RestController
@RequestMapping("/talk")
class TalkAPIController(
    @Autowired val talkService: TalkService
) {
    /** 個人トーク一覧取得 */
    @GetMapping
    fun getIndividualTalks(): TalksResponse {
        val talks = talkService.getIndividualTalks(MockTestData.user1.userId)
        return TalksResponse(talks.map { TalkInfo(it) })
    }

    /** 個人トーク一覧取得 */
    @GetMapping("/{talkId}")
    fun getIndividualTalk(
        @PathVariable("talkId") talkId: String
    ): TalkResponse {
        val talk = talkService.getTalk(talkId) ?: throw BadRequestException()
        return TalkResponse(TalkInfo(talk))
    }

    /** メッセージ一覧取得 */
    @GetMapping("/{talkId}/message")
    fun getIndividualTalk(
        @PathVariable("talkId") talkId: String,
        messageId: String? = null
    ): MessagesResponse {
        val messages = talkService.getMessages(talkId, messageId)
        return MessagesResponse(messages?.map { MessageInfo(it) })
    }

    /** 個人トーク追加 */
    @PostMapping
    fun addIndividualTalk(
        @Validated @RequestBody req: AddIndividualTalkRequest,
        bindingResult: BindingResult
    ): TalkResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insTalk = IndividualTalkIns(req.talkName, listOf(MockTestData.user1.userId, req.userId))

        val talk = talkService.addIndividualTalk(insTalk)
        return TalkResponse(TalkInfo(talk))
    }

    /** トーク更新 */
    @PutMapping("/{talkId}")
    fun updTalk(
        @PathVariable("talkId") talkId: String,
        @Validated @RequestBody req: UpdTalkRequest,
        bindingResult: BindingResult
    ): TalkResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updTalk = TalkUpd(talkId, req.talkName)

        val talk = talkService.updTalk(updTalk)
        return TalkResponse(TalkInfo(talk))
    }

    /** トーク削除 */
    @DeleteMapping("/{talkId}")
    fun deleteTalk(
        @PathVariable("talkId") talkId: String
    ) {
        talkService.deleteTalk(talkId)
    }
}