package com.example.communect.app.service

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.*
import com.example.communect.domain.repository.GroupRepository
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.domain.service.GroupService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

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
        return groupUserRepository.findByGroupIdAndUserId(groupId, userId)
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
        val groupLoginUser = group.aboveId?.let { getGroupUser(it, loginUserId) ?: throw BadRequestException()}
        val isSubGroup = (groupLoginUser != null)
        if(isSubGroup && !groupLoginUser!!.isSubGroupCreate) throw BadRequestException()

        val insGroup = groupRepository.insertGroup(group) ?: throw BadRequestException()

        val loginGroupUser = GroupUserIns(insGroup.groupId, loginUserId, groupLoginUser?.nickName, GroupRole.HIGH,
            isAdmin = true,
            isSubGroupCreate = true
        )
        val insLoginGroupUser = groupUserRepository.insertGroupUser(loginGroupUser) ?: throw BadRequestException()
        val userList = mutableListOf(insLoginGroupUser)
        userIds?.forEach {
            val user = if (isSubGroup){
                val aboveGroupUser = groupUserRepository.findByGroupIdAndUserId(group.aboveId!!, it) ?: throw BadRequestException()
                GroupUserIns(insGroup.groupId, it, aboveGroupUser.nickName, aboveGroupUser.role, aboveGroupUser.isAdmin, aboveGroupUser.isSubGroupCreate)
            }else{
                GroupUserIns(insGroup.groupId, it)
            }
            val insUser = groupUserRepository.insertGroupUser(user) ?: throw BadRequestException()
            userList.add(insUser)
        }

        return Pair(insGroup, getGroupUsers(insGroup.groupId))
    }

    /**
     *  グループ更新
     *  ユーザに管理者権限が必要
     *  @param group 更新情報
     *  @return 更新グループ
     */
    override fun updGroup(group: GroupUpd, loginUserId: String): Group {
        val user = groupUserRepository.findByGroupIdAndUserId(group.groupId, loginUserId) ?: throw BadRequestException()
        if(!user.isAdmin) throw BadRequestException()

        groupRepository.updateGroup(group)

        return groupRepository.findByGroupId(group.groupId) ?: throw BadRequestException()
    }

    /**
     *  グループ削除
     *  ユーザに管理者権限が必要
     *  @param groupId 削除対象グループID
     */
    override fun deleteGroup(groupId: String, loginUserId: String) {
        val user = groupUserRepository.findByGroupIdAndUserId(groupId, loginUserId) ?: throw BadRequestException()
        if(!user.isAdmin) throw BadRequestException()

        groupRepository.deleteByGroupId(groupId)
    }

    /**
     *  グループユーザ追加
     *  ユーザに管理者権限が必要
     *  @param user 登録ユーザ情報
     *  @return 登録ユーザ
     */
    override fun addGroupUser(user: GroupUserIns, loginUserId: String): GroupUser {
        val groupUser = groupUserRepository.findByGroupIdAndUserId(user.groupId, loginUserId) ?: throw BadRequestException()
        if(!groupUser.isAdmin) throw BadRequestException()

        return groupUserRepository.insertGroupUser(user) ?: throw BadRequestException()
    }

    /**
     *  グループユーザ更新
     *  ユーザに管理者権限が必要
     *  本人の場合はnicknameのみ管理者権限なしで変更可能
     *  @param user 更新ユーザ情報
     *  @return 更新ユーザ
     */
    override fun updGroupUser(user: GroupUserUpd, loginUserId: String): GroupUser {
        val groupUser = groupUserRepository.findByGroupUserId(user.groupUserId) ?: throw BadRequestException()
        val groupLoginUser = groupUserRepository.findByGroupIdAndUserId(groupUser.groupId, loginUserId) ?: throw BadRequestException()
        if(!groupLoginUser.isAdmin){
            if(groupUser.userId != loginUserId && (user.nickName == null || user.role != null || user.isAdmin != null || user.isSubGroupCreate != null)) throw BadRequestException()
        }

        groupUserRepository.updateGroupUser(user)

        return groupUserRepository.findByGroupUserId(user.groupUserId) ?: throw BadRequestException()
    }

    /**
     *  グループユーザ削除
     *  ユーザに管理者権限が必要
     *  同ユーザが下位グループにも属する場合そのユーザも削除
     *  @param groupUserId 削除グループユーザID
     */
    override fun deleteGroupUser(groupUserId: String, loginUserId: String) {
        val groupUser = groupUserRepository.findByGroupUserId(groupUserId) ?: throw BadRequestException()
        val groupLoginUser = groupUserRepository.findByGroupIdAndUserId(groupUser.groupId, loginUserId) ?: throw BadRequestException()
        if(!groupLoginUser.isAdmin){
            if(groupUser.userId != loginUserId) throw BadRequestException()
        }

        deleteSubGroupUser(groupUserId, groupUser.groupId, groupUser.userId)
    }

    /**
     * グループ所属確認
     * @param groupId グループID
     * @param loginUserId 所属確認ユーザID
     * @return true: 所属 false: 未所属
     */
    override fun hasGroupByGroupId(groupId: String, loginUserId: String): Boolean {
        return groupUserRepository.findByGroupIdAndUserId(groupId, loginUserId) != null
    }

    /**
     * 指定グループを含む下位グループの指定グループユーザを削除
     * @param groupUserId 削除対象グループユーザID
     * @param groupId グループID
     * @param userId ユーザID
     */
    private fun deleteSubGroupUser(groupUserId: String, groupId: String, userId: String) {
        groupRepository.findByAboveId(groupId).forEach {subGroup ->
            groupUserRepository.findByGroupIdAndUserId(subGroup.groupId, userId)?.let {
                deleteSubGroupUser(it.groupUserId, it.groupId, userId)
            }
        }
        groupUserRepository.deleteByGroupUserId(groupUserId)
    }
}