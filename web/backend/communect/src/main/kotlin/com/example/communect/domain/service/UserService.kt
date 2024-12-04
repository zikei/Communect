package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** ユーザ処理インターフェース */
interface UserService {
    /** ユーザ検索 */
    fun searchUser(keyword: String): List<User>

    /** ユーザ取得 */
    fun getUser(userId: String): User?

    /** ユーザ登録 */
    fun addUser(user: UserIns): User
}