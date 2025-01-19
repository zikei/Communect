package com.example.communect.domain.repository

import com.example.communect.domain.model.*

/** トークリポジトリ */
interface TalkRepository {
    /** トークIDによるグループトーク一覧の取得 */
    fun findByTalkId(talkId: String): Talk?

    /** トークIDによるグループトーク一覧の取得 トークにユーザの所属が必要 */
    fun findByTalkId(talkId: String, userId: String): Talk?

    /** グループIDによるグループトーク一覧の取得 */
    fun findGroupTalkByGroupId(groupId: String): List<Talk>

    /** ユーザIDによる個人トーク一覧の取得 */
    fun findIndividualTalkByUserId(userId: String): List<Talk>

    /** トークIDによる所属ユーザ一覧の取得 */
    fun findUserByTalkId(talkId: String): List<User>

    /** グループトーク追加 */
    fun insertGroupTalk(talk: GroupTalkIns): Talk

    /** 個人トーク追加 */
    fun insertIndividualTalk(talk: IndividualTalkIns): Talk

    /** トーク編集 */
    fun updateTalk(talk: TalkUpd)

    /** トーク削除 */
    fun deleteByTalkId(talkId: String)
}