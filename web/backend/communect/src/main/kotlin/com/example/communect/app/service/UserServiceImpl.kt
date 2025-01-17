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
        if(MockTestData.userList.any { it.userName == user.userName }) throw BadRequestException()
        val insUser = User(UUID.randomUUID().toString(), user.userName, user.nickName, user.email)
        MockTestData.userList.add(insUser)
        MockTestData.apikeys[insUser.userId] = apikeyService.generateApiKey()
        return insUser
    }

    /**
     *  ユーザ更新
     *  @param user 更新ユーザ情報
     *  @return 更新ユーザ
     */
    override fun updUser(user: UserUpd): User {
        if(MockTestData.userList.any { it.userName == user.userName }) throw BadRequestException()
        val index = MockTestData.userList.indexOfFirst { it.userId == user.userId }
        if(index == -1) throw BadRequestException()

        val updUser = User(user.userId, user.userName ?: MockTestData.userList[index].userName,
            user.nickName ?: MockTestData.userList[index].nickName, user.email ?: MockTestData.userList[index].email)

        MockTestData.userList[index] = updUser
        MockTestData.groupUserList.forEachIndexed { i, groupUser ->
            if(groupUser.userId == user.userId){
                MockTestData.groupUserList[i] = GroupUser(groupUser.groupUserId, groupUser.groupId, groupUser.userId,
                    updUser.userName, groupUser.nickName, groupUser.role, groupUser.isAdmin, groupUser.isSubGroupCreate)
            }
        }
        MockTestData.messageList.forEachIndexed { i, message ->
            if(message.userId == user.userId){
                MockTestData.messageList[i] = Message(message.messageId, message.message, message.createTime,
                    message.talkId, updUser.userId, updUser.userName, updUser.nickName)
            }
        }
        MockTestData.reactionList.forEachIndexed { i, reaction ->
            if(reaction.userId == user.userId){
                MockTestData.reactionList[i] = Reaction(reaction.reactionId, reaction.contactId, reaction.reactionTime,
                    reaction.choice, updUser.userId, updUser.userName, updUser.nickName)
            }
        }

        return MockTestData.userList[index]
    }

    /**
     *  ユーザ削除
     *  @param userId 退会ユーザID
     */
    override fun deleteUser(userId: String) {
        MockTestData.userList.removeAll { it.userId == userId }
    }

    /**
     *  apikey取得
     *  @param userId 取得ユーザID
     *  @return apikey
     */
    override fun getApikey(userId: String): String? {
        return MockTestData.apikeys[userId]
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