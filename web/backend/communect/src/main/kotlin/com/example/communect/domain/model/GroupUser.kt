package com.example.communect.domain.model

import com.example.communect.domain.enums.GroupRole

/** グループユーザエンティティ */
data class GroupUser(
    /** グループユーザID */
    val groupUserId: String,
    /** グループID */
    val groupId: String,
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String,
    /** 連絡権限 */
    val role: GroupRole,
    /** 管理者権限 */
    val isAdmin: Boolean,
    /** 下位グループ作成権限ID */
    val isSubGroupCreate: Boolean
)

/** 追加用グループユーザエンティティ */
data class GroupUserIns(
    /** グループID */
    val groupId: String,
    /** ユーザID */
    val userId: String,
    /** 表示名 */
    val nickName: String?,
    /** 連絡権限 */
    val role: GroupRole,
    /** 管理者権限 */
    val isAdmin: Boolean,
    /** 下位グループ作成権限ID */
    val isSubGroupCreate: Boolean
)

/** 更新用グループユーザエンティティ */
data class GroupUserUpd(
    /** グループユーザID */
    val groupUserId: String,
    /** 表示名 */
    val nickName: String?,
    /** 連絡権限 */
    val role: GroupRole?,
    /** 管理者権限 */
    val isAdmin: Boolean?,
    /** 下位グループ作成権限ID */
    val isSubGroupCreate: Boolean?
)