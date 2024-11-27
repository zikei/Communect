package com.example.communect.domain.model

/** 連絡エンティティ */
data class Choice(
    /** 選択肢ID */
    val choiceId: String,
    /** 連絡ID */
    val contactId: String,
    /** 選択肢 */
    val choice: String
)

/** 追加用連絡エンティティ */
data class ChoiceIns(
    /** 連絡ID */
    val contactId: String,
    /** 選択肢 */
    val choice: String
)