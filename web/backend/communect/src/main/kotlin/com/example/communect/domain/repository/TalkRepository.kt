package com.example.communect.domain.repository

import com.example.communect.domain.model.Talk

/** トークリポジトリ */
interface TalkRepository {
    /** グループIDによるグループトーク一覧の取得 */
    fun findByTalkId(talkId: String): Talk?

    /** グループIDによるグループトーク一覧の取得 */
    fun findGroupTalkByGroupId(groupId: String): List<Talk>

    /** ユーザIDによる個人トーク一覧の取得 */
    fun findIndividualTalkByUserId(userId: String): List<Talk>
}