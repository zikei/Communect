package com.example.communect.app.service

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.*
import com.example.communect.domain.service.TalkService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.UUID

/** トーク処理実装クラス */
@Service
class TalkServiceImpl(
    @Value("\${messageRowCount}") private val messageLimit: Int
): TalkService {
    /**
     *  グループトーク一覧取得
     *  @param groupId 検索対象グループID
     *  @return トークリスト
     */
    override fun getGroupTalks(groupId: String): List<Talk> {
        return MockTestData.groupTalkList.filter { it.groupId == groupId }.map { Talk(it.talkId, it.talkName, TalkType.GROUP) }
    }

    /**
     *  グループトーク一覧取得
     *  @param userId 検索対象ユーザID
     *  @return トークリスト
     */
    override fun getIndividualTalks(userId: String): List<Talk> {
        return MockTestData.individualTalkList.filter { it.users.any { user -> user.userId == userId } }.map { Talk(it.talkId, it.talkName, TalkType.GROUP) }
    }

    /**
     *  トーク取得
     *  @param talkId 検索対象トークID
     *  @return トーク
     */
    override fun getTalk(talkId: String): Talk? {
        return MockTestData.talkList.find { it.talkId == talkId }
    }

    /**
     *  メッセージ取得
     *  @param talkId 検索対象トークID
     *  @param lastMessageId 取得済み最古メッセージID
     *  @return トーク
     */
    override fun getMessages(talkId: String, lastMessageId: String?): List<Message>? {
        val message = lastMessageId?.let {id -> MockTestData.messageList.find { it.messageId == lastMessageId } }
        val messages = MockTestData.messageList.filter {
            it.talkId == talkId && ( message == null || it.createTime.isBefore(message.createTime) )
        }.sortedBy { it.createTime }
        return messages.take(messageLimit).sortedByDescending { it.createTime }
    }

    /**
     *  グループトーク作成
     *  @param group 作成グループ情報
     *  @return 作成トーク
     */
    override fun addGroupTalk(group: GroupTalkIns): Talk {
        val insGroupTalk = GroupTalk(UUID.randomUUID().toString(), group.talkName, group.groupId)
        val insTalk = Talk(insGroupTalk.talkId, insGroupTalk.talkName, TalkType.GROUP)
        MockTestData.talkList.add(insTalk)
        MockTestData.groupTalkList.add(insGroupTalk)

        return insTalk
    }

    /**
     *  個人トーク作成
     *  @param talk 作成個人トーク情報
     *  @return 作成トーク
     */
    override fun addIndividualTalk(talk: IndividualTalkIns): Talk {
        val talkUsers = talk.userIds.map { id ->
            MockTestData.userList.find { it.userId == id } ?: throw BadRequestException()
        }
        val insIndividualTalk = IndividualTalk(UUID.randomUUID().toString(), talk.talkName, talkUsers)
        val insTalk = Talk(insIndividualTalk.talkId, insIndividualTalk.talkName, TalkType.INDIVIDUAL)
        MockTestData.talkList.add(insTalk)
        MockTestData.individualTalkList.add(insIndividualTalk)

        return insTalk
    }
}