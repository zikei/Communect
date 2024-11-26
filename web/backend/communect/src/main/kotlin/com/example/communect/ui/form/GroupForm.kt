package com.example.communect.ui.form

import com.example.communect.domain.model.Group
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

/** グループリスト返却 */
data class GroupsResponse(val groups: List<GroupInfo>)

/** グループ詳細返却 */
data class GroupResponse(val group: GroupInfo, val myStatus: GroupUserInfo)

/** グループ作成返却 */
data class CreateGroupResponse(val group: GroupInfo, val users: List<GroupUserInfo>)

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

/** グループ情報 */
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