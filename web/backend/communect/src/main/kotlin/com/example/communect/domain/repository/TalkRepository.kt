package com.example.communect.domain.repository

import com.example.communect.domain.model.GroupTalkIns
import com.example.communect.domain.model.IndividualTalkIns
import com.example.communect.domain.model.Talk
import com.example.communect.domain.model.TalkUpd

/** トークリポジトリ */
interface TalkRepository {
    /** トークIDによるグループトーク一覧の取得 */
    fun findByTalkId(talkId: String): Talk?

    /** グループIDによるグループトーク一覧の取得 */
    fun findGroupTalkByGroupId(groupId: String): List<Talk>

    /** ユーザIDによる個人トーク一覧の取得 */
    fun findIndividualTalkByUserId(userId: String): List<Talk>

    /** グループトーク追加 */
    fun insertGroupTalk(talk: GroupTalkIns): Talk

    /** 個人トーク追加 */
    fun insertIndividualTalk(talk: IndividualTalkIns): Talk

    /** トーク編集 */
    fun updateTalk(talk: TalkUpd)

    /** トーク削除 */
    fun deleteByTalkId(talkId: String)
}