package com.example.communect.ui.controller

import com.example.communect.domain.service.ContactService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/** 連絡APIコントローラ */
@RestController
@RequestMapping("/contact")
class ContactAPIController(
    @Autowired val contactService: ContactService
) {

}