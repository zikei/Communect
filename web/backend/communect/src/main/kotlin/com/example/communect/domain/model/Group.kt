package com.example.communect.domain.model

/** グループエンティティ */
data class Group(
    /** グループID */
    val groupId: String,
    /** グループ名 */
    val groupName: String,
    /** 上位グループID */
    val aboveId: String?
)

/** 追加用グループエンティティ */
data class GroupIns(
    /** グループ名 */
    val groupName: String,
    /** 上位グループID */
    val aboveId: String?
)

/** 更新用グループエンティティ */
data class GroupUpd(
    /** グループID */
    val groupId: String,
    /** グループ名 */
    val groupName: String?
)