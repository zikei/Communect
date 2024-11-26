package com.example.communect.ui.controller

import com.example.communect.domain.service.GroupService
import com.example.communect.ui.form.GroupInfo
import com.example.communect.ui.form.GroupResponse
import com.example.communect.ui.form.GroupUserInfo
import com.example.communect.ui.form.GroupsResponse
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

/** グループAPIコントローラ */
@RestController
@RequestMapping("/group")
class GroupAPIController(
    @Autowired val groupService: GroupService
) {
    /** グループ一覧取得 */
    @GetMapping
    fun getGroups(): GroupsResponse{
        val groups = groupService.getGroups("")
        return GroupsResponse(groups.map { GroupInfo(it) })
    }

    /** グループ一覧取得 */
    @GetMapping("/{groupId}")
    fun getGroup(
        @PathVariable("groupId") groupId: String
    ): GroupResponse {
        val group = groupService.getGroup(groupId)?.let { GroupInfo(it) } ?: throw BadRequestException()
        val groupUser = groupService.getGroupUser(groupId, "")?.let{ GroupUserInfo(it) } ?: throw BadRequestException()
        return GroupResponse(group, groupUser)
    }
}