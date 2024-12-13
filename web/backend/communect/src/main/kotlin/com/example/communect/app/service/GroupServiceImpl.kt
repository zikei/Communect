package com.example.communect.app.service

import com.example.communect.app.service.MockTestData.user1
import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.*
import com.example.communect.domain.repository.GroupRepository
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.domain.service.GroupService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.UUID

/** グループ処理実装クラス */
@Service
class GroupServiceImpl(
    @Autowired val groupRepository : GroupRepository,
    @Autowired val groupUserRepository : GroupUserRepository
): GroupService {
    /**
     *  グループ一覧取得
     *  @param userId 所属グループを検索するユーザID
     *  @return ユーザが所属するグループリスト
     */
    override fun getGroups(userId: String): List<Group> {
        return groupRepository.findByUserId(userId)
    }

    /**
     *  グループ取得
     *  @param groupId 検索グループID
     *  @return 検索結果
     */
    override fun getGroup(groupId: String): Group? {
        return groupRepository.findByGroupId(groupId)
    }

    /**
     *  グループユーザ一覧取得
     *  @param groupId 検索グループID
     *  @return 検索結果ユーザリスト
     */
    override fun getGroupUsers(groupId: String): List<GroupUser> {
        return groupUserRepository.findByGroupId(groupId)
    }

    /**
     *  グループユーザ取得
     *  @param groupId 検索グループID
     *  @param userId 検索ユーザID
     *  @return 検索結果ユーザ
     */
    override fun getGroupUser(groupId: String, userId: String): GroupUser? {
        return MockTestData.groupUserList.find{ it.groupId == groupId && it.userId == userId }
    }

    /**
     *  グループ作成
     *  サブグループの場合親グループでユーザにサブグループ作成権限が必要
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
     *  グループ更新
     *  ユーザに管理者権限が必要
     *  本人の場合はnicknameのみ管理者権限なしで変更可能
     *  @param group 更新情報
     *  @return 更新グループ
     */
    override fun updGroup(group: GroupUpd, loginUserId: String): Group {
        val index = MockTestData.groupList.indexOfFirst { it.groupId == group.groupId }
        if(index == -1) throw BadRequestException()
        val groupName = group.groupName ?: MockTestData.groupList[index].groupName
        val aboveId = if(group.aboveId == ""){
            null
        }else{
            group.aboveId ?: MockTestData.groupList[index].aboveId
        }
        MockTestData.groupList[index] = Group(group.groupId, groupName, aboveId)

        return MockTestData.groupList[index]
    }

    /**
     *  グループ削除
     *  ユーザに管理者権限が必要
     *  @param groupId 削除対象グループID
     */
    override fun deleteGroup(groupId: String, loginUserId: String) {
        MockTestData.groupList.filter { it.aboveId == groupId }.forEach {
            deleteGroup(it.groupId, loginUserId)
        }
        MockTestData.groupList.removeAll { it.groupId == groupId }
        MockTestData.groupUserList.removeAll { it.groupId == groupId }
    }

    /**
     *  グループユーザ追加
     *  ユーザに管理者権限が必要
     *  @param user 登録ユーザ情報
     *  @return 登録ユーザ
     */
    override fun addGroupUser(user: GroupUserIns, loginUserId: String): GroupUser {
        val targetUser = MockTestData.userList.find { it.userId == user.userId } ?: throw BadRequestException()
        val group = getGroup(user.groupId) ?: throw BadRequestException()
        val insUser = if(group.aboveId == null){
            GroupUser(UUID.randomUUID().toString(), user.groupId, targetUser.userId, targetUser.userName, targetUser.nickName, GroupRole.NONE, false, false)
        }else{
            val above = MockTestData.groupUserList.find { it.groupId == group.aboveId && it.userId == user.userId } ?: throw BadRequestException()
            GroupUser(UUID.randomUUID().toString(), user.groupId, above.userId, above.userName, above.nickName, above.role, above.isAdmin, above.isSubGroupCreate)
        }
        MockTestData.groupUserList.add(insUser)

        return insUser
    }

    /**
     *  グループユーザ更新
     *  ユーザに管理者権限が必要
     *  @param user 更新ユーザ情報
     *  @return 更新ユーザ
     */
    override fun updGroupUser(user: GroupUserUpd, loginUserId: String): GroupUser {
        val index = MockTestData.groupUserList.indexOfFirst { it.groupUserId == user.groupUserId }
        if(index == -1) throw BadRequestException()

        val nickName = user.nickName ?: MockTestData.groupUserList[index].nickName
        val role = user.role ?: MockTestData.groupUserList[index].role
        val isAdmin = user.isAdmin ?: MockTestData.groupUserList[index].isAdmin
        val isSubGroupCreate = user.isSubGroupCreate ?: MockTestData.groupUserList[index].isSubGroupCreate
        MockTestData.groupUserList[index] = GroupUser(user.groupUserId, MockTestData.groupUserList[index].groupId, MockTestData.groupUserList[index].userId, MockTestData.groupUserList[index].userName, nickName, role, isAdmin, isSubGroupCreate)

        return MockTestData.groupUserList[index]
    }

    /**
     *  グループユーザ削除
     *  ユーザに管理者権限が必要
     *  同ユーザが下位グループにも属する場合そのユーザも削除
     *  @param groupUserId 削除グループユーザID
     */
    override fun deleteGroupUser(groupUserId: String, loginUserId: String) {
        val groupUser = MockTestData.groupUserList.find { it.groupUserId == groupUserId } ?: throw BadRequestException()
        val group = MockTestData.groupList.find { it.groupId == groupUser.groupId } ?: throw BadRequestException()

        MockTestData.groupList.filter { it.aboveId == group.groupId }.forEach { subGroup ->
            getGroupUsers(subGroup.groupId).find { it.userId == groupUser.userId }?.let {
                deleteGroupUser(it.groupUserId, loginUserId)
            }
        }

        MockTestData.groupUserList.removeAll { it.groupUserId == groupUserId }
    }
}