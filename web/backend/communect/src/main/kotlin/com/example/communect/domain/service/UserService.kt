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

    /** ユーザ更新 */
    fun updUser(user: UserUpd): User

    /** ユーザ退会 */
    fun deleteUser(userId: String)

    /** APIキー取得 */
    fun getApikey(userId: String): String?

    /** APIキー更新 */
    fun updApikey(userId: String): String?
}