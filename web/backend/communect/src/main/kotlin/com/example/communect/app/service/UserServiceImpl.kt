package com.example.communect.app.service

import com.example.communect.domain.model.User
import com.example.communect.domain.model.UserIns
import com.example.communect.domain.service.UserService
import org.apache.coyote.BadRequestException
import org.springframework.stereotype.Service
import java.util.UUID

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

    /**
     *  ユーザ検索
     *  @param userId 検索ユーザID
     *  @return 検索結果ユーザ
     */
    override fun getUser(userId: String): User? {
        return MockTestData.userList.find { it.userId == userId }
    }

    /**
     *  ユーザ登録
     *  @param user 登録ユーザ情報
     *  @return 登録ユーザ
     */
    override fun addUser(user: UserIns): User {
        if(MockTestData.userList.any { it.userName == user.userName }) throw BadRequestException()
        val insUser = User(UUID.randomUUID().toString(), user.userName, user.nickName, user.email)
        MockTestData.userList.add(insUser)
        return insUser
    }
}