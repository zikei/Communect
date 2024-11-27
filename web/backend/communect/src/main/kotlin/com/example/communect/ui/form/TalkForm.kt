package com.example.communect.ui.form

import com.example.communect.domain.model.GroupTalk
import com.example.communect.domain.model.Talk

/** トークルームリスト返却 */
data class TalksResponse(val talks: List<TalkInfo>)

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
    constructor(talk: GroupTalk): this(
        talk.talkId,
        talk.talkName
    )
}