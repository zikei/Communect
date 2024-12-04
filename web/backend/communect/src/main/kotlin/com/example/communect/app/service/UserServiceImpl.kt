package com.example.communect.app.service

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.*
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
}