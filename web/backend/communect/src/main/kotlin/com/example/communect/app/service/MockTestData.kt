package com.example.communect.app.service

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.GroupRole
import com.example.communect.domain.enums.Importance
import com.example.communect.domain.model.*
import java.time.LocalDateTime
import java.util.*

object MockTestData {
    // TODO:モック用データのため後に削除
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

    val user1 = User(UUID.randomUUID().toString(),"user1","プロデューサー","P@example.com")
    val user2 = User(UUID.randomUUID().toString(),"user2","根緒亜紗里","asari@example.com")
    val user3 = User(UUID.randomUUID().toString(),"user3","十王邦夫","juo@example.com")
    val user4 = User(UUID.randomUUID().toString(),"user4","篠澤広","hiro@example.com")
    val user5 = User(UUID.randomUUID().toString(),"user5","真城優","mashiro@example.com")

    private val groupUser1 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.NONE, false, false)
    private val groupUser2 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user2.userId, user2.userName, user2.nickName, GroupRole.MEDIUM, false, true)
    private val groupUser3 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user3.userId, user3.userName, user3.nickName, GroupRole.NONE, false, false)
    private val groupUser4 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user4.userId, user4.userName, user4.nickName, GroupRole.NONE, false, false)
    private val groupUser5 = GroupUser(UUID.randomUUID().toString(), group1.groupId, user5.userId, user5.userName, user5.nickName, GroupRole.NONE, false, false)
    private val groupUser6 = GroupUser(UUID.randomUUID().toString(), group2.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.NONE, false, false)
    private val groupUser7 = GroupUser(UUID.randomUUID().toString(), group2.groupId, user2.userId, user2.userName, user2.nickName, GroupRole.MEDIUM, false, true)
    private val groupUser8 = GroupUser(UUID.randomUUID().toString(), group3.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser9 = GroupUser(UUID.randomUUID().toString(), group3.groupId, user2.userId, user2.userName, user2.nickName, GroupRole.HIGH, true, true)
    private val groupUser10 = GroupUser(UUID.randomUUID().toString(), group4.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser11 = GroupUser(UUID.randomUUID().toString(), group5.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser12 = GroupUser(UUID.randomUUID().toString(), group6.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser13 = GroupUser(UUID.randomUUID().toString(), group7.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser14 = GroupUser(UUID.randomUUID().toString(), group8.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser15 = GroupUser(UUID.randomUUID().toString(), group9.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)
    private val groupUser16 = GroupUser(UUID.randomUUID().toString(), group10.groupId, user1.userId, user1.userName, user1.nickName, GroupRole.LOW, false, false)

    private val groupTalk1 = GroupTalk(UUID.randomUUID().toString(), "全体チャット", group1.groupId)
    private val groupTalk2 = GroupTalk(UUID.randomUUID().toString(), "プロデュースのコツ", group3.groupId)
    private val groupTalk3 = GroupTalk(UUID.randomUUID().toString(), "相談", group3.groupId)
    private val groupTalk4 = GroupTalk(UUID.randomUUID().toString(), "Python", group8.groupId)
    private val groupTalk5 = GroupTalk(UUID.randomUUID().toString(), "卒業論文面接", group8.groupId)
    private val groupTalk6 = GroupTalk(UUID.randomUUID().toString(), "奨学金", group8.groupId)
    private val groupTalk7 = GroupTalk(UUID.randomUUID().toString(), "学園祭", group8.groupId)
    private val groupTalk8 = GroupTalk(UUID.randomUUID().toString(), "就職", group8.groupId)

    private val contact1 = Contact(UUID.randomUUID().toString(), group1.groupId, group1.groupName, "本日は大雨のため休校です", ContactType.CONFIRM, Importance.HIGH, LocalDateTime.of(2024,11, 20,7,0), null)
    private val contact2 = Contact(UUID.randomUUID().toString(), group8.groupId, group6.groupName, "29日 9:30に卒業アルバム写真撮影", ContactType.INFORM, Importance.LOW, LocalDateTime.of(2024,11, 21,8,0), null)

    private val contact3Id = UUID.randomUUID().toString()

    private val choice1 = Choice(UUID.randomUUID().toString(), contact3Id, "スポッチャ")
    private val choice2 = Choice(UUID.randomUUID().toString(), contact3Id, "スペースラボ")
    private val choice3 = Choice(UUID.randomUUID().toString(), contact3Id, "コロナ ボーリング")
    private val choiceList = mutableListOf(choice1, choice2, choice3)

    private val contact3 = Contact(contact3Id, group8.groupId, group6.groupName, "クラスレク", ContactType.CONFIRM, Importance.MEDIUM, LocalDateTime.of(2024,11, 23,13,20), choiceList)

    private val reaction1 = Reaction(UUID.randomUUID().toString(), contact1.contactId, LocalDateTime.of(2024,11, 20,7,21, 50), null, user1.userId, user1.userName, user1.nickName)
    private val reaction2 = Reaction(UUID.randomUUID().toString(), contact1.contactId, LocalDateTime.of(2024,11, 20,7,22, 30), null, user2.userId, user2.userName, user2.nickName)
    private val reaction3 = Reaction(UUID.randomUUID().toString(), contact1.contactId, LocalDateTime.of(2024,11, 20,7,25, 20), null, user3.userId, user3.userName, user3.nickName)
    private val reaction4 = Reaction(UUID.randomUUID().toString(), contact1.contactId, LocalDateTime.of(2024,11, 20,7,30, 50), null, user4.userId, user4.userName, user4.nickName)
    private val reaction5 = Reaction(UUID.randomUUID().toString(), contact3.contactId, LocalDateTime.of(2024,11, 21,8,19, 20), choice1, user1.userId, user1.userName, user1.nickName)

    val userList = mutableListOf(user1, user2, user3, user4, user5)
    val groupList = mutableListOf(group1, group2, group3, group4, group5 ,group6, group7, group8, group9, group10)
    val groupUserList = mutableListOf(groupUser1, groupUser2, groupUser3, groupUser4, groupUser5, groupUser6, groupUser7, groupUser8, groupUser9, groupUser10, groupUser11, groupUser12, groupUser13, groupUser14, groupUser15, groupUser16)
    val groupTalkList = mutableListOf(groupTalk1, groupTalk2, groupTalk3, groupTalk4, groupTalk5, groupTalk6, groupTalk7, groupTalk8)
    val contactList = mutableListOf(contact1, contact2, contact3)
    val reactionList = mutableListOf(reaction1, reaction2, reaction3, reaction4, reaction5)
}