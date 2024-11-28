package com.example.communect.app.service

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.GroupTalk
import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.service.TalkService
import org.springframework.stereotype.Service
import java.util.UUID

/** トーク処理実装クラス */
@Service
class TalkServiceImpl(): TalkService {
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
     *  グループトーク作成
     *  @param group 作成グループ情報
     *  @return 作成トーク
     */
    override fun addGroupTalk(group: GroupTalkIns): Talk {
        val insGroupTalk = GroupTalk(UUID.randomUUID().toString(), group.talkName, group.groupId)
        MockTestData.groupTalkList.add(insGroupTalk)
        return Talk(insGroupTalk.talkId, insGroupTalk.talkName, TalkType.GROUP)
    }
}