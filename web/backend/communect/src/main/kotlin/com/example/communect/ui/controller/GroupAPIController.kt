package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.service.GroupService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
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
        val groupUser = groupService.getGroupUser(groupId, MockTestData.user1.userId)?.let{ GroupUserInfo(it) } ?: throw BadRequestException()
        return GroupResponse(group, groupUser)
    }

    /** グループ作成 */
    @PostMapping
    fun getGroup(
        @Validated @RequestBody req: CreateGroupRequest,
        bindingResult: BindingResult
    ): CreateGroupResponse {
        if (bindingResult.hasErrors()){
            println(MockTestData.userList)
            println(bindingResult.allErrors)
            throw BadRequestException()
        }
        val insGroup = GroupIns(req.name, req.above)
        val userIds = req.users

        val (group, groupUsers) = groupService.createGroup(insGroup, MockTestData.user1.userId, userIds)
        return CreateGroupResponse(GroupInfo(group), groupUsers.map { GroupUserInfo(it) })
    }
}