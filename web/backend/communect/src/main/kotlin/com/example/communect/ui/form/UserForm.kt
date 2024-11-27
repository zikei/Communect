package com.example.communect.ui.form

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.GroupUser


/** グループユーザリスト返却 */
data class GroupUsersResponse(val users: List<GroupUserInfo>)

/** グループユーザ返却 */
data class GroupUserResponse(val user: GroupUserInfo)

/** グループユーザ情報 */
data class GroupUserInfo(
    /** グループユーザID */
    val groupUserId: String,
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
){
    constructor(groupUser: GroupUser): this(
        groupUser.groupUserId,
        groupUser.userId,
        groupUser.userName,
        groupUser.nickName,
        groupUser.role,
        groupUser.isAdmin,
        groupUser.isSubGroupCreate
    )
}

/** グループユーザ追加リクエスト */
data class AddGroupUserRequest(val userId: String)

/** グループユーザ更新リクエスト */
data class UpdGroupUserRequest(
    /** グループユーザID */
    val groupUserId: String,
    /** 表示名 */
    val nickName: String? = null,
    /** 連絡権限 */
    val role: GroupRole? = null,
    /** 管理者権限 */
    val isAdmin: Boolean? = null,
    /** 下位グループ作成権限ID */
    val isSubGroupCreate: Boolean? = null
)