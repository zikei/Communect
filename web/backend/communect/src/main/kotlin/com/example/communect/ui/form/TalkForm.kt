package com.example.communect.ui.form

import com.example.communect.domain.model.Talk
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

/** トークルームリスト返却 */
data class TalksResponse(val talks: List<TalkInfo>)

/** トークルーム返却 */
data class TalkResponse(val talk: TalkInfo)

/** トークルーム情報 */
data class TalkInfo(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String
){
    constructor(talk: Talk): this(
        talk.talkId,
        talk.talkName
    )
}

/** グループトーク作成リクエスト */
data class AddGroupTalkRequest(
    /** トーク名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val talkName: String
)