package com.example.communect.domain.repository

import com.example.communect.domain.model.LoginUser

/** ユーザリポジトリ */
interface UserRepository {
    /** ユーザ名によるログインユーザモデルの取得 */
    fun findLoginUserByUserName(name: String): LoginUser?

    /** apikeyによるログインユーザモデルの取得 */
    fun findLoginUserByApikey(apikey: String): LoginUser?
}