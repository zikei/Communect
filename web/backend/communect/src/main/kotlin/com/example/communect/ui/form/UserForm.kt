package com.example.communect.ui.form

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.User


/** グループユーザリスト返却 */
data class GroupUsersResponse(val users: List<GroupUserInfo>)

/** グループユーザ返却 */
data class GroupUserResponse(val user: GroupUserInfo)

/** ユーザリスト返却 */
data class UsersResponse(val users: List<UserInfo>)

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

/** ユーザ情報 */
data class UserInfo(
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String
){
    constructor(user: User): this(
        user.userId,
        user.userName,
        user.nickName
    )
}

/** グループユーザ追加リクエスト */
data class AddGroupUserRequest(val userId: String)

/** グループユーザ削除リクエスト */
data class DeleteGroupUserRequest(val groupUserId: String)

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