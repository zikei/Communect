package com.example.communect.app.service

import com.example.communect.domain.model.Login
import com.example.communect.domain.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** 認証ユーザクラス */
@Service
class CustomUserDetailsService(
    @Autowired val userRepo: UserRepository
): UserDetailsService {

    @Transactional(readOnly =  true)
    override fun loadUserByUsername(username: String?): UserDetails {
        val user = username?.let { userRepo.findLoginUserByUserName(it) }
        user ?: throw UsernameNotFoundException("username NotFound: $username")
        return Login(user)
    }

    fun loadUserByApiKey(apikey: String?): UserDetails? {
        val user = apikey?.let { userRepo.findLoginUserByApikey(apikey) }
        return user?.let { Login(it) }
    }
}
