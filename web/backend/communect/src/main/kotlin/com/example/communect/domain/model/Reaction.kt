package com.example.communect.domain.model

import java.time.LocalDateTime

/** リアクションエンティティ */
data class Reaction(
    /** リアクションID */
    val reactionId: String,
    /** 連絡ID */
    val contactId: String,
    /** リアクション日時 */
    val reactionTime: LocalDateTime,
    /** 選択肢 */
    val choice: Choice?,
    /** リアクションユーザId */
    val userId: String,
    /** リアクションユーザ名 */
    val userName: String,
    /** リアクションユーザ表示名 */
    val userNickName: String
)

/** 追加用リアクションエンティティ */
data class ReactionIns(
    /** リアクションID */
    val reactionId: String,
    /** 連絡ID */
    val contactId: String,
    /** 選択肢 */
    val choice: Choice?,
    /** リアクションユーザId */
    val userId: String
)