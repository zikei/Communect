package com.example.communect.infrastructure.db.record.custom

import com.example.communect.domain.enums.GroupRole

data class CustomGroupUser(
    var groupuserid: String? = null,
    var groupid: String? = null,
    var userid: String? = null,
    var username: String? = null,
    var nickname: String? = null,
    var groupnickname: String? = null,
    var role: GroupRole? = null,
    var isadmin: Boolean? = null,
    var issubgroupcreate: Boolean? = null
)