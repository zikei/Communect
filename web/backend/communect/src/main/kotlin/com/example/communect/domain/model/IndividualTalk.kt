package com.example.communect.domain.model

/** 個人トークエンティティ */
data class IndividualTalk(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String,
    /** ユーザ */
    val users: List<User>
)

/** 追加用個人トークエンティティ */
data class IndividualTalkIns(
    /** トーク名 */
    val talkName: String,
    /** ユーザIDリスト */
    val userIds: List<String>
)