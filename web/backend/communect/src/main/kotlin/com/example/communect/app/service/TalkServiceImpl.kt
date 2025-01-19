package com.example.communect.app.service

import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.model.TalkUpd
import com.example.communect.domain.repository.GroupUserRepository
import com.example.communect.domain.repository.TalkRepository
import com.example.communect.domain.service.TalkService
import org.apache.coyote.BadRequestException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

/** トーク処理実装クラス */
@Service
class TalkServiceImpl(
    @Autowired val talkRepository: TalkRepository,
    @Autowired val groupUserRepository: GroupUserRepository
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
    override fun getTalk(talkId: String, loginUserId: String): Talk? {
        return talkRepository.findByTalkId(talkId, loginUserId)
    }

    /**
     *  グループトーク作成
     *  @param talk 作成グループ情報
     *  @return 作成トーク
     */
    override fun addGroupTalk(talk: GroupTalkIns, loginUserId: String): Talk {
        groupUserRepository.findByGroupIdAndUserId(talk.groupId, loginUserId) ?: throw BadRequestException()
        return talkRepository.insertGroupTalk(talk)
    }

    /**
     *  個人トーク作成
     *  @param talk 作成個人トーク情報
     *  @return 作成トーク
     */
    override fun addIndividualTalk(talk: IndividualTalkIns): Talk {
        return talkRepository.insertIndividualTalk(talk)
    }

    /**
     *  トーク更新
     *  @param talk 更新トーク情報
     *  @return 更新トーク
     */
    override fun updTalk(talk: TalkUpd, loginUserId: String): Talk {
        if(!hasTalk(talk.talkId, loginUserId)) throw BadRequestException("talk does not exist")
        talkRepository.updateTalk(talk)
        return talkRepository.findByTalkId(talk.talkId) ?: throw BadRequestException("talk does not exist")
    }

    /**
     *  トーク削除
     *  @param talkId 削除対象トークID
     */
    override fun deleteTalk(talkId: String, loginUserId: String) {
        if(!hasTalk(talkId, loginUserId)) throw BadRequestException("talk does not exist")
        talkRepository.deleteByTalkId(talkId)
    }

    /**
     * トーク所属確認
     * @param talkId トークID
     * @param loginUserId 所属確認ユーザID
     * @return true: 所属 false: 未所属
     */
    private fun hasTalk(talkId: String, loginUserId: String): Boolean {
        return talkRepository.findByTalkId(talkId, loginUserId) != null
    }
}