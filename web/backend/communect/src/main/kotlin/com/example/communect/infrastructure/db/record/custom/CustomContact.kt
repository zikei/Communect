package com.example.communect.infrastructure.db.record.custom

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import java.time.LocalDateTime

data class CustomContact(
    var contactid: String? = null,
    var groupid: String? = null,
    var userid: String? = null,
    var username: String? = null,
    var nickname: String? = null,
    var groupnickname: String? = null,
    var groupname: String? = null,
    var message: String? = null,
    var contacttype: ContactType? = null,
    var importance: Importance? = null,
    var createtime: LocalDateTime? = null
)