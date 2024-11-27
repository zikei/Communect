package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.*
import com.example.communect.domain.service.GroupService
import com.example.communect.domain.service.TalkService
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
    @Autowired val groupService: GroupService,
    @Autowired val talkService: TalkService
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
    fun createGroup(
        @Validated @RequestBody req: CreateGroupRequest,
        bindingResult: BindingResult
    ): CreateGroupResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insGroup = GroupIns(req.name, req.above)
        val userIds = req.users

        val (group, groupUsers) = groupService.createGroup(insGroup, MockTestData.user1.userId, userIds)
        return CreateGroupResponse(GroupInfo(group), groupUsers.map { GroupUserInfo(it) })
    }

    /** グループ更新 */
    @PutMapping("/{groupId}")
    fun updGroup(
        @PathVariable("groupId") groupId: String,
        @Validated @RequestBody req: UpdGroupRequest,
        bindingResult: BindingResult
    ): UpdGroupResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updGroup = GroupUpd(groupId, req.name, req.above)

        val group = groupService.updGroup(updGroup)
        return UpdGroupResponse(GroupInfo(group))
    }

    /** グループ削除 */
    @DeleteMapping("/{groupId}")
    fun deleteGroup(
        @PathVariable("groupId") groupId: String
    ) {
        groupService.deleteGroup(groupId)
    }

    /** グループユーザ一覧取得 */
    @GetMapping("/{groupId}/user")
    fun getGroupUsers(
        @PathVariable("groupId") groupId: String
    ): GroupUsersResponse{
        val users = groupService.getGroupUsers(groupId)
        return GroupUsersResponse(users.map { GroupUserInfo(it) })
    }

    /** グループユーザ一追加 */
    @PostMapping("/{groupId}/user")
    fun addGroupUser(
        @PathVariable("groupId") groupId: String,
        @RequestBody req: AddGroupUserRequest
    ): GroupUserResponse{
        val user = groupService.addGroupUser(GroupUserIns(groupId, req.userId))
        return GroupUserResponse(GroupUserInfo(user))
    }

    /** グループユーザ一更新 */
    @PutMapping("/{groupId}/user")
    fun updGroupUser(
        @RequestBody req: UpdGroupUserRequest
    ): GroupUserResponse{
        val user = groupService.updGroupUser(GroupUserUpd(req.groupUserId, req.nickName, req.role, req.isAdmin, req.isSubGroupCreate))
        return GroupUserResponse(GroupUserInfo(user))
    }

    /** グループユーザ一削除 */
    @DeleteMapping("/{groupId}/user")
    fun deleteGroupUser(
        @RequestBody req: DeleteGroupUserRequest
    ){
       groupService.deleteGroupUser(req.groupUserId)
    }

    /** グループトーク一覧取得 */
    @GetMapping("/{groupId}/talk")
    fun getGroupTalks(
        @PathVariable("groupId") groupId: String
    ): TalksResponse{
        val talks = talkService.getGroupTalks(groupId)
        return TalksResponse(talks.map { TalkInfo(it) })
    }

    /** グループトーク追加 */
    @PostMapping("/{groupId}/talk")
    fun addGroupTalk(
        @PathVariable("groupId") groupId: String,
        @Validated @RequestBody req: AddGroupTalkRequest,
        bindingResult: BindingResult
    ): TalkResponse{
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insGroupTalk = GroupTalkIns(req.talkName, groupId)

        val talk = talkService.addGroupTalk(insGroupTalk)
        return TalkResponse(TalkInfo(talk))
    }
}