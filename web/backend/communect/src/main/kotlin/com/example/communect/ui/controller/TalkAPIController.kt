package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.service.TalkService
import com.example.communect.ui.form.TalkInfo
import com.example.communect.ui.form.TalksResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/** トークAPIコントローラ */
@RestController
@RequestMapping("/talk")
class TalkAPIController(
    @Autowired val talkService: TalkService
) {
    /** 個人トーク一覧取得 */
    @GetMapping
    fun getGroupTalks(): TalksResponse {
        val talks = talkService.getIndividualTalks(MockTestData.user1.userId)
        return TalksResponse(talks.map { TalkInfo(it) })
    }
}