package com.example.communect.domain.model

/** ユーザエンティティ */
data class User(
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String,
    /** メールアドレス */
    val email: String
)

/** 追加用ユーザエンティティ */
data class UserIns(
    /** ユーザ名 */
    val userName: String,
    /** 表示名 */
    val nickName: String,
    /** パスワード */
    val password: String,
    /** メールアドレス */
    val email: String,
    /** APIキー */
    val apikey: String
)

/** 更新用ユーザエンティティ */
data class UserUpd(
    /** ユーザID */
    val userId: String,
    /** ユーザ名 */
    val userName: String?,
    /** 表示名 */
    val nickName: String?,
    /** パスワード */
    val password: String?,
    /** メールアドレス */
    val email: String?
)