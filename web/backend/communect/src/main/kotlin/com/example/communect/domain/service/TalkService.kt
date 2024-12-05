package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** トーク処理インターフェース */
interface TalkService {
    /** グループトーク一覧取得 */
    fun getGroupTalks(groupId: String): List<Talk>

    /** 個人トーク一覧取得 */
    fun getIndividualTalks(userId: String): List<Talk>

    /** トーク取得 */
    fun getTalk(talkId: String): Talk?

    /** グループトーク作成 */
    fun addGroupTalk(group: GroupTalkIns): Talk

    /** 個人トーク作成 */
    fun addIndividualTalk(talk: IndividualTalkIns): Talk

    /** トーク更新 */
    fun updTalk(talk: TalkUpd): Talk

    /** トーク削除 */
    fun deleteTalk(talkId: String)
}