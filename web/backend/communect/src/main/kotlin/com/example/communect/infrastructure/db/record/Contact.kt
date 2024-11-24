/*
 * Auto-generated file. Created by MyBatis Generator
 */
package com.example.communect.infrastructure.db.record

import com.example.communect.domain.enums.ContactType
import com.example.communect.domain.enums.Importance
import java.time.LocalDateTime

data class Contact(
    var contactid: String? = null,
    var noticegroupid: String? = null,
    var message: String? = null,
    var contacttype: ContactType? = null,
    var importance: Importance? = null,
    var createtime: LocalDateTime? = null
)