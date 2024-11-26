package com.example.communect.app.service

import com.example.communect.domain.model.Group
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

    private val groupList = listOf(group1, group2, group3, group4, group5 ,group6, group7, group8, group9, group10)
    // --テストデータ--

    /**
     *  グループ一覧取得
     *  @param userId 所属グループを検索するユーザID
     *  @return ユーザが所属するグループリスト
     */
    override fun getGroups(userId: String): List<Group> {
        return groupList
    }
}