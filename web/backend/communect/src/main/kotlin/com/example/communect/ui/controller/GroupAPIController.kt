package com.example.communect.ui.controller

import com.example.communect.domain.model.*
import com.example.communect.domain.service.ContactService
import com.example.communect.domain.service.GroupService
import com.example.communect.domain.service.TalkService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** グループAPIコントローラ */
@RestController
@RequestMapping("/group")
class GroupAPIController(
    @Autowired val groupService: GroupService,
    @Autowired val talkService: TalkService,
    @Autowired val contactService: ContactService
) {
    /** グループ一覧取得 */
    @GetMapping
    fun getGroups(@AuthenticationPrincipal loginUser: Login): GroupsResponse{
        val groups = groupService.getGroups(loginUser.user.userId)
        return GroupsResponse(groups.map { GroupInfo(it) })
    }

    /** グループ詳細取得 */
    @GetMapping("/{groupId}")
    fun getGroup(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("groupId") groupId: String
    ): GroupResponse {
        val group = groupService.getGroup(groupId)?.let { GroupInfo(it) } ?: throw BadRequestException()
        val groupUser = groupService.getGroupUser(groupId, loginUser.user.userId)?.let{ GroupUserInfo(it) } ?: throw BadRequestException()
        return GroupResponse(group, groupUser)
    }

    /** グループ作成 */
    @PostMapping
    fun createGroup(
        @AuthenticationPrincipal loginUser: Login,
        @Validated @RequestBody req: CreateGroupRequest,
        bindingResult: BindingResult
    ): CreateGroupResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insGroup = GroupIns(req.name, req.above)
        val userIds = req.users

        val (group, groupUsers) = groupService.createGroup(insGroup, loginUser.user.userId, userIds)
        return CreateGroupResponse(GroupInfo(group), groupUsers.map { GroupUserInfo(it) })
    }

    /** グループ更新 */
    @PutMapping("/{groupId}")
    fun updGroup(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("groupId") groupId: String,
        @Validated @RequestBody req: UpdGroupRequest,
        bindingResult: BindingResult
    ): UpdGroupResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updGroup = GroupUpd(groupId, req.name)

        val group = groupService.updGroup(updGroup, loginUser.user.userId)
        return UpdGroupResponse(GroupInfo(group))
    }

    /** グループ削除 */
    @DeleteMapping("/{groupId}")
    fun deleteGroup(
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("groupId") groupId: String
    ) {
        groupService.deleteGroup(groupId, loginUser.user.userId)
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
        @AuthenticationPrincipal loginUser: Login,
        @PathVariable("groupId") groupId: String,
        @Validated @RequestBody req: AddGroupUserRequest,
        bindingResult: BindingResult
    ): GroupUserResponse{
        if (bindingResult.hasErrors()) throw BadRequestException()
        val user = groupService.addGroupUser(GroupUserIns(groupId, req.userId), loginUser.user.userId)
        return GroupUserResponse(GroupUserInfo(user))
    }

    /** グループユーザ一更新 */
    @PutMapping("/{groupId}/user")
    fun updGroupUser(
        @AuthenticationPrincipal loginUser: Login,
        @Validated @RequestBody req: UpdGroupUserRequest,
        bindingResult: BindingResult
    ): GroupUserResponse{
        if (bindingResult.hasErrors()) throw BadRequestException()
        val user = groupService.updGroupUser(GroupUserUpd(req.groupUserId, req.nickName, req.role, req.isAdmin, req.isSubGroupCreate), loginUser.user.userId)
        return GroupUserResponse(GroupUserInfo(user))
    }

    /** グループユーザ一削除 */
    @DeleteMapping("/{groupId}/user")
    fun deleteGroupUser(
        @AuthenticationPrincipal loginUser: Login,
        @RequestBody req: DeleteGroupUserRequest
    ){
       groupService.deleteGroupUser(req.groupUserId, loginUser.user.userId)
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

    /** 連絡一覧取得 */
    @GetMapping("/{groupId}/contact")
    fun getContacts(
        @PathVariable("groupId") groupId: String,
        contactId: String? = null
    ): ContactsResponse{
        val contacts = contactService.getContactsByGroupId(groupId, contactId)
        return ContactsResponse(contacts?.map { ContactInfo(it) })
    }
}