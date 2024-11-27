package com.example.communect.domain.service

import com.example.communect.domain.model.*

/** トーク処理インターフェース */
interface TalkService {
    /** グループトーク一覧取得 */
    fun getGroupTalks(groupId: String): List<Talk>

    /** グループトーク作成 */
    fun addGroupTalk(group: GroupTalkIns): Talk
}