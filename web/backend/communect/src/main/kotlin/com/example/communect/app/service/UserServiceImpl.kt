package com.example.communect.app.service

import com.example.communect.domain.model.*
import com.example.communect.domain.repository.UserRepository
import com.example.communect.domain.service.UserService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.*

/** ユーザ処理実装クラス */
@Service
class UserServiceImpl(
    @Autowired val userRepository: UserRepository
): UserService {
    private val apikeyService = ApikeyService()
    /**
     *  ユーザ検索
     *  @param keyword ユーザ名の部分一致 OR ユーザID
     *  @return 検索結果ユーザリスト
     */
    override fun searchUser(keyword: String): List<User> {
        return userRepository.findByKeyword(keyword)
    }

    /**
     *  ユーザ検索
     *  @param userId 検索ユーザID
     *  @return 検索結果ユーザ
     */
    override fun getUser(userId: String): User? {
        return userRepository.findByUserId(userId)
    }

    /**
     *  ユーザ登録
     *  @param user 登録ユーザ情報
     *  @return 登録ユーザ
     */
    override fun addUser(user: UserIns): User {
        if(userRepository.findByUserName(user.userName) != null) throw BadRequestException("username is used")
        val apikey = apikeyService.generateApiKey()
        return userRepository.insertUser(user, apikey)
    }

    /**
     *  ユーザ更新
     *  @param user 更新ユーザ情報
     *  @return 更新ユーザ
     */
    override fun updUser(user: UserUpd): User {
        val oldUser = userRepository.findByUserId(user.userId) ?: throw BadRequestException("user does not exist")
        if(user.userName != null && oldUser.userName != user.userName){
            if(userRepository.findByUserName(user.userName) != null) throw BadRequestException("username is used")
        }

        userRepository.updateUser(user)

        return getUser(user.userId)!!
    }

    /**
     *  ユーザ削除
     *  @param userId 退会ユーザID
     */
    override fun deleteUser(userId: String) {
        userRepository.deleteByUserId(userId)
    }

    /**
     *  apikey取得
     *  @param userId 取得ユーザID
     *  @return apikey
     */
    override fun getApikey(userId: String): String? {
        return userRepository.findApikeyByUserId(userId)
    }

    /**
     *  apikey更新
     *  @param userId 更新ユーザID
     *  @return apikey
     */
    override fun updApikey(userId: String): String? {
        MockTestData.apikeys[userId] = apikeyService.generateApiKey()
        return MockTestData.apikeys[userId]
    }

    /** apikey生成クラス */
    private class ApikeyService{
        private val secureRandom = SecureRandom()
        private val encoder = Base64.getUrlEncoder().withoutPadding()
        private val keyLength = 32

        fun generateApiKey(): String {
            val randomBytes = ByteArray(keyLength)
            secureRandom.nextBytes(randomBytes)
            val apikey = encoder.encodeToString(randomBytes)

            return apikey
        }
    }
}