package com.example.communect.app.service

import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.model.Group
import com.example.communect.domain.model.GroupUser
import com.example.communect.domain.service.GroupService
import org.springframework.stereotype.Service
import java.util.UUID

/** グループ処理実装クラス */
@Service
class GroupServiceImpl(): GroupService {
    // --テストデータ--
    private val group1 = Group(UUID.randomUUID().toString(), "初星学園", null)
    private val group2 = Group(UUID.randomUUID().toString(), "専門大学", group1.groupId)
    private val group3 = Group(UUID.randomUUID().toString(), "プロデューサー科", group2.groupId)
    private val group4 = Group(UUID.randomUUID().toString(), "電子開発学園", null)
    private val group5 = Group(UUID.randomUUID().toString(), "KCS", group4.groupId)
    private val group6 = Group(UUID.randomUUID().toString(), "KCSK", group5.groupId)
    private val group7 = Group(UUID.randomUUID().toString(), "大学併修科", group6.groupId)
    private val group8 = Group(UUID.randomUUID().toString(), "R4A1", group7.groupId)
    private val group9 = Group(UUID.randomUUID().toString(), "国試対策", group6.groupId)
    private val group10 = Group(UUID.randomUUID().toString(), "高度対策クラス", group9.groupId)

    private val user1Id = UUID.randomUUID().toString()
    private val user2Id = UUID.randomUUID().toString()
    private val user3Id = UUID.randomUUID().toString()
    private val user4Id = UUID.randomUUID().toString()
    private val user5Id = UUID.randomUUID().toString()

    private val groupUser1 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user1Id, "user1", "プロデューサー", GroupRole.NONE, false, false)
    private val groupUser2 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user2Id, "user2", "根緒亜紗里", GroupRole.MEDIUM, false, true)
    private val groupUser3 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user3Id, "user3", "十王邦夫", GroupRole.NONE, false, false)
    private val groupUser4 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user4Id, "user4", "篠澤広", GroupRole.NONE, false, false)
    private val groupUser5 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user5Id, "user5", "真城優", GroupRole.NONE, false, false)
    private val groupUser6 = GroupUser(UUID.randomUUID().toString(), group2.groupId, user1Id, "user1", "プロデューサー", GroupRole.NONE, false, false)
    private val groupUser7 = GroupUser(UUID.randomUUID().toString(), group2.groupId, user2Id, "user2", "根緒亜紗里", GroupRole.MEDIUM, false, true)
    private val groupUser8 = GroupUser(UUID.randomUUID().toString(), group3.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser9 = GroupUser(UUID.randomUUID().toString(), group3.groupId, user2Id, "user2", "根緒亜紗里", GroupRole.HIGH, true, true)
    private val groupUser10 = GroupUser(UUID.randomUUID().toString(), group4.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser11 = GroupUser(UUID.randomUUID().toString(), group5.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser12 = GroupUser(UUID.randomUUID().toString(), group6.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser13 = GroupUser(UUID.randomUUID().toString(), group7.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser14 = GroupUser(UUID.randomUUID().toString(), group8.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser15 = GroupUser(UUID.randomUUID().toString(), group9.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)
    private val groupUser16 = GroupUser(UUID.randomUUID().toString(), group10.groupId, user1Id, "user1", "プロデューサー", GroupRole.LOW, false, false)

    private val groupList = listOf(group1, group2, group3, group4, group5 ,group6, group7, group8, group9, group10)
    private val groupUserList = listOf(groupUser1, groupUser2, groupUser3, groupUser4, groupUser5, groupUser6, groupUser7, groupUser8, groupUser9, groupUser10, groupUser11, groupUser12, groupUser13, groupUser14, groupUser15, groupUser16)
    // --テストデータ--

    /**
     *  グループ一覧取得
     *  @param userId 所属グループを検索するユーザID
     *  @return ユーザが所属するグループリスト
     */
    override fun getGroups(userId: String): List<Group> {
        return groupList
    }

    /**
     *  グループ取得
     *  @param groupId 検索グループID
     *  @return 検索結果
     */
    override fun getGroup(groupId: String): Group? {
        return groupList.find { it.groupId == groupId }
    }

    /**
     *  グループ取得
     *  @param groupId 検索グループID
     *  @return 検索結果ユーザリスト
     */
    override fun getGroupUsers(groupId: String): List<GroupUser> {
        return groupUserList.filter { it.groupId == groupId }
    }

    /**
     *  グループ取得
     *  @param groupId 検索グループID
     *  @return 検索結果ユーザリスト
     */
    override fun getGroupUser(groupId: String, userId: String): GroupUser? {
        return groupUserList.find{ it.groupId == groupId && it.userId == user1Id }
    }
}