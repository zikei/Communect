package com.example.communect.domain.model

import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.User

data class LoginUser(
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String,
    /** パスワード */
    val password: String,
    /** メールアドレス */
    val email: String,
    /** apikey **/
    val apikey: String
)

data class Login(val user: LoginUser)
    : User(
        user.userName,
        user.password,
        AuthorityUtils.createAuthorityList("USER")
    )