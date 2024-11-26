package com.example.communect.app.service

import com.example.communect.app.service.MockTestData.user1
import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupIns
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.model.GroupUserIns
import com.example.communect.domain.service.GroupService
import org.apache.coyote.BadRequestException
import org.springframework.stereotype.Service
import java.util.UUID

/** グループ処理実装クラス */
@Service
class GroupServiceImpl(): GroupService {
    /**
     *  グループ一覧取得
     *  @param userId 所属グループを検索するユーザID
     *  @return ユーザが所属するグループリスト
     */
    override fun getGroups(userId: String): List<Group> {
        return MockTestData.groupList
    }

    /**
     *  グループ取得
     *  @param groupId 検索グループID
     *  @return 検索結果
     */
    override fun getGroup(groupId: String): Group? {
        return MockTestData.groupList.find { it.groupId == groupId }
    }

    /**
     *  グループユーザ一覧取得
     *  @param groupId 検索グループID
     *  @return 検索結果ユーザリスト
     */
    override fun getGroupUsers(groupId: String): List<GroupUser> {
        return MockTestData.groupUserList.filter { it.groupId == groupId }
    }

    /**
     *  グループユーザ取得
     *  @param groupId 検索グループID
     *  @param userId 検索ユーザID
     *  @return 検索結果ユーザリスト
     */
    override fun getGroupUser(groupId: String, userId: String): GroupUser? {
        return MockTestData.groupUserList.find{ it.groupId == groupId && it.userId == userId }
    }

    /**
     *  グループ作成
     *  @param group 登録グループ
     *  @param loginUserId 作成者ID（ログインユーザID）
     *  @param userIds 登録ユーザIDリスト
     *  @return 登録グループ、登録ユーザリスト
     */
    override fun createGroup(
        group: GroupIns,
        loginUserId: String,
        userIds: List<String>?
    ): Pair<Group, List<GroupUser>> {
        val insGroup = Group(UUID.randomUUID().toString(), group.groupName, group.aboveId)
        MockTestData.groupList.add(insGroup)

        val insUsers = if(group.aboveId == null){
            val loginGroupUser = GroupUser(UUID.randomUUID().toString(), insGroup.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.HIGH, true, true)
            val userList = userIds?.mapNotNull { userId ->
                val user = MockTestData.userList.find { it.userId == userId }
                user?.let {
                    GroupUser(UUID.randomUUID().toString(), insGroup.groupId, user.userId, user.userName, user.nickName, GroupRole.NONE, false, false)
                }
            }?.toMutableList() ?: mutableListOf()
            userList.add(loginGroupUser)
            userList
        }else{
            val aboveGroupUserList = getGroupUsers(group.aboveId)
            val loginGroupUser = aboveGroupUserList.find { it.userId == loginUserId }?.let {
                GroupUser(UUID.randomUUID().toString(), insGroup.groupId, it.userId, it.userName, it.nickName, GroupRole.HIGH, true, true)
            } ?: throw BadRequestException()
            val userList = userIds?.mapNotNull { userId ->
                aboveGroupUserList.find { it.userId == userId }?.let {
                    GroupUser(UUID.randomUUID().toString(), insGroup.groupId, it.userId, it.userName, it.nickName, it.role, it.isAdmin, it.isSubGroupCreate)
                }
            }?.toMutableList() ?: mutableListOf()
            userList.add(loginGroupUser)
            userList
        }
        MockTestData.groupUserList.addAll(insUsers)

        return Pair(insGroup, getGroupUsers(insGroup.groupId))
    }

    /**
     *  グループユーザ追加
     *  @param user 登録ユーザ情報
     *  @return 登録ユーザ
     */
    override fun addGroupUser(user: GroupUserIns): GroupUser {
        val targetUser = getGroupUsers(user.groupId).find { it.userId == user.userId } ?: throw BadRequestException()
        val insUser = GroupUser(UUID.randomUUID().toString(), user.groupId, targetUser.userId, targetUser.userName, user.nickName ?: targetUser.nickName, user.role, user.isAdmin, user.isSubGroupCreate)
        MockTestData.groupUserList.add(insUser)

        return insUser
    }
}