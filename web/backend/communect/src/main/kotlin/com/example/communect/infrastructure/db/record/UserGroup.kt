/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.record

import com.example.communect.domain.enums.GroupRole

data class UserGroup(
    var usergroupid: String? = null,
    var noticegroupid: String? = null,
    var userid: String? = null,
    var nickname: String? = null,
    var role: GroupRole? = null,
    var subgroupcreateauthority: Boolean? = null,
    var groupadmin: Boolean? = null
)