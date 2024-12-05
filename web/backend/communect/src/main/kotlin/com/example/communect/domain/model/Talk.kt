package com.example.communect.domain.model

import com.example.communect.domain.enums.TalkType

/** トークルームエンティティ */
data class Talk(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String,
    /** トークタイプ */
    val talkType: TalkType
)

/** 更新用トークルームエンティティ */
data class TalkUpd(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String?
)