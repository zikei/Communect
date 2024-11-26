package com.example.communect.ui.form

import com.example.communect.domain.model.Group

/** グループリスト返却 */
data class GroupsResponse(val groups: List<GroupInfo>)

data class GroupResponse(val group: GroupInfo)

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
