package com.example.communect.ui.controller

import com.example.communect.domain.service.GroupService
import com.example.communect.ui.form.GroupInfo
import com.example.communect.ui.form.GroupsResponse
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
}