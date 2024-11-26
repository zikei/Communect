package com.example.communect.ui.form

import com.example.communect.domain.model.Group
import com.example.communect.ui.validator.NullOrNotBlank
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Null
import jakarta.validation.constraints.Size

/** グループリスト返却 */
data class GroupsResponse(val groups: List<GroupInfo>)

/** グループ詳細返却 */
data class GroupResponse(val group: GroupInfo, val myStatus: GroupUserInfo)

/** グループ作成返却 */
data class CreateGroupResponse(val group: GroupInfo, val users: List<GroupUserInfo>)

/** グループ更新返却 */
data class UpdGroupResponse(val group: GroupInfo)

/** グループ情報 */
data class GroupInfo(
    /** グループID */
    val groupId: String,
    /** グループ名 */
    val groupName: String,
    /** 上位グループID */
    val aboveId: String?
){
    constructor(group: Group): this(
        group.groupId,
        group.groupName,
        group.aboveId
    )
}

/** グループ作成リクエスト */
data class CreateGroupRequest(
    /** グループ名 */
    @get:NotBlank
    @get:NotEmpty
    @get:Size(max = 20)
    val name: String,
    /** 上位グループID */
    val above: String? = null,
    /** ユーザIDリスト */
    val users: List<String>? = null
)

/** グループ更新リクエスト */
data class UpdGroupRequest(
    /** グループ名 */
    @get:NullOrNotBlank
    @get:Size(max = 20)
    val name: String? = null,
    /** 上位グループID */
    val above: String? = null,
)