package com.example.communect.domain.service

import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.model.TalkUpd

/** トーク処理インターフェース */
interface TalkService {
    /** グループトーク一覧取得 */
    fun getGroupTalks(groupId: String): List<Talk>

    /** 個人トーク一覧取得 */
    fun getIndividualTalks(userId: String): List<Talk>

    /** トーク取得 */
    fun getTalk(talkId: String, loginUserId: String): Talk?

    /** グループトーク作成 */
    fun addGroupTalk(talk: GroupTalkIns): Talk

    /** 個人トーク作成 */
    fun addIndividualTalk(talk: IndividualTalkIns): Talk

    /** トーク更新 */
    fun updTalk(talk: TalkUpd): Talk

    /** トーク削除 */
    fun deleteTalk(talkId: String)

    /** トーク所属確認 */
    fun hasTalk(talkId: String, loginUserId: String): Boolean
}