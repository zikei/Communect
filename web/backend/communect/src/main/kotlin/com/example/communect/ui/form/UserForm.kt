package com.example.communect.ui.form

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.User
import com.example.communect.ui.validator.NullOrNotBlank
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size


/** グループユーザリスト返却 */
data class GroupUsersResponse(val users: List<GroupUserInfo>)

/** グループユーザ返却 */
data class GroupUserResponse(val user: GroupUserInfo)

/** ユーザリスト返却 */
data class UsersResponse(val users: List<UserInfo>)

/** 自身のユーザ情報返却 */
data class MyUserInfoResponse(val user: MyUserInfo)

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

/** ユーザ情報 */
data class MyUserInfo(
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String,
    /** メールアドレス */
    var email: String
){
    constructor(user: User): this(
        user.userId,
        user.userName,
        user.nickName,
        user.email
    )
}

/** グループユーザ追加リクエスト */
data class AddGroupUserRequest(val userId: String)

/** グループユーザ削除リクエスト */
data class DeleteGroupUserRequest(val groupUserId: String)

/** グループユーザ更新リクエスト */
data class UpdGroupUserRequest(
    /** グループユーザID */
    @get:NullOrNotBlank
    @get:Size(max = 20)
    val groupUserId: String,
    /** 表示名 */
    @get:NullOrNotBlank
    @get:Size(max = 20)
    val nickName: String? = null,
    /** 連絡権限 */
    val role: GroupRole? = null,
    /** 管理者権限 */
    val isAdmin: Boolean? = null,
    /** 下位グループ作成権限ID */
    val isSubGroupCreate: Boolean? = null
)

/** ユーザ登録リクエスト */
data class AddUserRequest(
    /** ユーザ名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Pattern(regexp="^[a-zA-Z0-9]+$")
    @get:Size(max = 20)
    val userName: String,
    /** 表示名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val nickName: String,
    /** パスワード */
    @get:Pattern(regexp="^[!-~]+$")
    var password: String,
    /** メールアドレス */
    var email: String
)