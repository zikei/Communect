package com.example.communect.infrastructure.db.record.custom

import java.time.LocalDateTime

data class CustomReaction(
    var reactionid: String? = null,
    var contactid: String? = null,
    var reactiontime: LocalDateTime? = null,
    var choiceid: String? = null,
    var choices: String? = null,
    var userid: String? = null,
    var username: String? = null,
    var nickname: String? = null,
    var groupnickname: String? = null,
)