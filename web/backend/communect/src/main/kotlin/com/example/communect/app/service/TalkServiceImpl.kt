package com.example.communect.app.service

import com.example.communect.domain.enums.TalkType
import com.example.communect.domain.model.*
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.domain.repository.UserRepository
import com.example.communect.domain.service.TalkService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

/** トーク処理実装クラス */
@Service
class TalkServiceImpl(
    @Autowired val talkRepository: TalkRepository
) : TalkService {
    /**
     *  グループトーク一覧取得
     *  @param groupId 検索対象グループID
     *  @return トークリスト
     */
    override fun getGroupTalks(groupId: String): List<Talk> {
        return talkRepository.findGroupTalkByGroupId(groupId)
    }

    /**
     *  個人トーク一覧取得
     *  @param userId 検索対象ユーザID
     *  @return トークリスト
     */
    override fun getIndividualTalks(userId: String): List<Talk> {
        return talkRepository.findIndividualTalkByUserId(userId)
    }

    /**
     *  トーク取得
     *  @param talkId 検索対象トークID
     *  @return トーク
     */
    override fun getTalk(talkId: String): Talk? {
        return talkRepository.findByTalkId(talkId)
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

    /**
     *  トーク更新
     *  @param talk 更新トーク情報
     *  @return 更新トーク
     */
    override fun updTalk(talk: TalkUpd): Talk {
        val index = MockTestData.talkList.indexOfFirst { it.talkId == talk.talkId }
        if(index == -1) throw BadRequestException()

        val talkType = MockTestData.talkList[index].talkType
        val updTalk = Talk(talk.talkId, talk.talkName ?: MockTestData.talkList[index].talkName, talkType)

        MockTestData.talkList[index] = updTalk

        if(talkType == TalkType.GROUP){
            val groupTalkIndex = MockTestData.groupTalkList.indexOfFirst { it.talkId == talk.talkId }
            MockTestData.groupTalkList[groupTalkIndex] = GroupTalk(updTalk.talkId, updTalk.talkName, MockTestData.groupTalkList[groupTalkIndex].groupId)
        }else if(talkType == TalkType.INDIVIDUAL){
            val individualTalkIndex = MockTestData.individualTalkList.indexOfFirst { it.talkId == talk.talkId }
            MockTestData.individualTalkList[individualTalkIndex] = IndividualTalk(updTalk.talkId, updTalk.talkName, MockTestData.individualTalkList[individualTalkIndex].users)
        }

        return MockTestData.talkList[index]
    }

    /**
     *  トーク削除
     *  @param talkId 削除対象トークID
     */
    override fun deleteTalk(talkId: String) {
        val talk = MockTestData.talkList.find { it.talkId == talkId } ?: throw BadRequestException()
        MockTestData.talkList.removeAll { it.talkId == talkId }
        if(talk.talkType == TalkType.GROUP){
            MockTestData.groupTalkList.removeAll { it.talkId == talkId }
        }else if(talk.talkType == TalkType.INDIVIDUAL){
            MockTestData.individualTalkList.removeAll { it.talkId == talkId }
        }
    }
}