package com.example.communect.domain.model

/** グループトークエンティティ */
data class GroupTalk(
    /** トークID */
    val talkId: String,
    /** トーク名 */
    val talkName: String,
    /** グループID */
    val groupId: String
)

/** 追加用グループトークエンティティ */
data class GroupTalkIns(
    /** トーク名 */
    val talkName: String,
    /** グループID */
    val groupId: String
)