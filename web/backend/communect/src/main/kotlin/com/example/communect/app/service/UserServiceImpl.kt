package com.example.communect.app.service

import com.example.communect.domain.model.User
import com.example.communect.domain.service.UserService
import org.springframework.stereotype.Service

/** ユーザ処理実装クラス */
@Service
class UserServiceImpl(
): UserService {
    /**
     *  ユーザ検索
     *  @param keyword ユーザ名の部分一致 OR ユーザID
     *  @return 検索結果ユーザリスト
     */
    override fun searchUser(keyword: String): List<User> {
        return MockTestData.userList.filter { it.userId == keyword || it.userName.contains(keyword, ignoreCase = true) }
    }
}