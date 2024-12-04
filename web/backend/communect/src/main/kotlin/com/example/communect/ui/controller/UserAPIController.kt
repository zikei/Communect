package com.example.communect.ui.controller

import com.example.communect.app.service.MockTestData
import com.example.communect.domain.model.UserIns
import com.example.communect.domain.model.UserUpd
import com.example.communect.domain.service.UserService
import com.example.communect.ui.form.*
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
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
    ): MyUserInfoResponse {
        val user = userService.getUser(MockTestData.user1.userId) ?: throw BadRequestException()
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
        @Validated @RequestBody req: UpdUserRequest,
        bindingResult: BindingResult
    ): MyUserInfoResponse {
        if (bindingResult.hasErrors()) throw BadRequestException()
        val updUser = UserUpd(MockTestData.user1.userId, req.userName, req.nickName, req.password, req.email)
        val user = userService.updUser(updUser)
        return MyUserInfoResponse(MyUserInfo(user))
    }

    /** ユーザ削除 */
    @DeleteMapping
    fun deleteUser(
    ) {
        userService.deleteUser(MockTestData.user1.userId)
    }

    /** APIキー取得 */
    @GetMapping("/apikey")
    fun getApikey(
    ): ApikeyResponse {
        val apikey = userService.getApikey(MockTestData.user1.userId) ?: throw BadRequestException()
        return ApikeyResponse(apikey)
    }

    /** APIキー更新 */
    @PutMapping("/apikey")
    fun updApikey(
    ): ApikeyResponse {
        val apikey = userService.updApikey(MockTestData.user1.userId) ?: throw BadRequestException()
        return ApikeyResponse(apikey)
    }
}