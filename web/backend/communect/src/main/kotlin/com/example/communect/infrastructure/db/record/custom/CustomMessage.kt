package com.example.communect.infrastructure.db.record.custom

import java.time.LocalDateTime

data class CustomMessage(
    var messageid: String? = null,
    var message: String? = null,
    var createtime: LocalDateTime? = null,
    var talkid: String? = null,
    var userid: String? = null,
    var username: String? = null,
    var nickname: String? = null,
    var groupnickname: String? = null
)