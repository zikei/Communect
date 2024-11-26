package com.example.communect.ui.form

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.GroupUser


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
