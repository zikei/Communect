package com.example.communect.domain.repository

import com.example.communect.domain.model.LoginUser
import com.example.communect.domain.model.User
import com.example.communect.domain.model.UserIns
import com.example.communect.domain.model.UserUpd

/** ユーザリポジトリ */
interface UserRepository {
    /** ユーザ名によるログインユーザモデルの取得 */
    fun findLoginUserByUserName(name: String): LoginUser?

    /** apikeyによるログインユーザモデルの取得 */
    fun findLoginUserByApikey(apikey: String): LoginUser?

    /**
     * キーワードによるユーザの取得
     * @param keyword ユーザ名の部分一致 OR ユーザID
     */
    fun findByKeyword(keyword: String): List<User>

    /** ユーザIDによるユーザの取得 */
    fun findByUserId(userId: String): User?

    /** ユーザIDによるユーザの取得 */
    fun findByUserName(name: String): User?

    /** ユーザIDによるapikeyの取得 */
    fun findApikeyByUserId(userId: String): String?

    /** ユーザ追加 */
    fun insertUser(user: UserIns, apikey: String): User

    /** ユーザ更新 */
    fun updateUser(user: UserUpd)

    /** ユーザIDによるapikeyの更新 */
    fun updateApikeyByUserId(userId: String, apikey: String)

    /** ユーザ削除 */
    fun deleteByUserId(userId: String)
}