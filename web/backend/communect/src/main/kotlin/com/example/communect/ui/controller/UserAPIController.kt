package com.example.communect.ui.controller

import com.example.communect.domain.service.UserService
import com.example.communect.ui.form.UserInfo
import com.example.communect.ui.form.UsersResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/** ユーザAPIコントローラ */
@RestController
@RequestMapping("/user")
class UserAPIController(
    @Autowired val userService: UserService
) {
    /** ユーザ検索 */
    @GetMapping
    fun getGroups(
        @RequestParam keyword: String
    ): UsersResponse {
        val users = userService.searchUser(keyword)
        return UsersResponse(users.map { UserInfo(it) })
    }
}