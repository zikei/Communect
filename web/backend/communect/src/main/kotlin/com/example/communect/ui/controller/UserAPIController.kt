package com.example.communect.ui.controller

import com.example.communect.domain.model.Login
import com.example.communect.domain.model.UserIns
import com.example.communect.domain.model.UserUpd
import com.example.communect.domain.service.UserService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.validation.BindingResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/** ユーザAPIコントローラ */
@RestController
@RequestMapping("/user")
class UserAPIController(
    @Autowired val userService: UserService
) {
    /** ユーザ検索 */
    @GetMapping
    fun searchUser(
        @RequestParam keyword: String
    ): UsersResponse {
        val users = userService.searchUser(keyword)
        return UsersResponse(users.map { UserInfo(it) })
    }

    /** ログインユーザ情報取得 */
    @GetMapping("/login")
    fun getLoginUser(
        @AuthenticationPrincipal loginUser: Login
    ): MyUserInfoResponse {
        val user = userService.getUser(loginUser.user.userId) ?: throw BadRequestException()
        return MyUserInfoResponse(MyUserInfo(user))
    }

    /** ユーザ登録 */
    @PostMapping
    fun addUser(
        @Validated @RequestBody req: AddUserRequest,
        bindingResult: BindingResult
    ): MyUserInfoResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val insUser = UserIns(req.userName, req.nickName, req.password, req.email)
        val user = userService.addUser(insUser)
        return MyUserInfoResponse(MyUserInfo(user))
    }

    /** ユーザ更新 */
    @PutMapping
    fun updUser(
        @AuthenticationPrincipal loginUser: Login,
        @Validated @RequestBody req: UpdUserRequest,
        bindingResult: BindingResult
    ): MyUserInfoResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updUser = UserUpd(loginUser.user.userId, req.userName, req.nickName, req.password, req.email)
        val user = userService.updUser(updUser)
        return MyUserInfoResponse(MyUserInfo(user))
    }

    /** ユーザ削除 */
    @DeleteMapping
    fun deleteUser(
        @AuthenticationPrincipal loginUser: Login
    ) {
        userService.deleteUser(loginUser.user.userId)
    }

    /** APIキー取得 */
    @GetMapping("/apikey")
    fun getApikey(
        @AuthenticationPrincipal loginUser: Login
    ): ApikeyResponse {
        val apikey = userService.getApikey(loginUser.user.userId) ?: throw BadRequestException()
        return ApikeyResponse(apikey)
    }

    /** APIキー更新 */
    @PutMapping("/apikey")
    fun updApikey(
        @AuthenticationPrincipal loginUser: Login
    ): ApikeyResponse {
        val apikey = userService.updApikey(loginUser.user.userId) ?: throw BadRequestException()
        return ApikeyResponse(apikey)
    }
}