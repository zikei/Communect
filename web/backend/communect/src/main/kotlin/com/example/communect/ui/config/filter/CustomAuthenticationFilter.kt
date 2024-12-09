package com.example.communect.ui.config.filter

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

class CustomAuthenticationFilter: UsernamePasswordAuthenticationFilter(){

    override fun attemptAuthentication(
        request: HttpServletRequest,
        response: HttpServletResponse
    ): Authentication {
        return if(isJsonReq(request)){
            jsonAttemptAuthentication(request)
        }else{
            super.attemptAuthentication(request, response)
        }
    }

    private fun isJsonReq(request: HttpServletRequest): Boolean{
        return request.contentType.contains("application/json")
    }

    private fun jsonAttemptAuthentication(
        request: HttpServletRequest
    ): Authentication {
        val objectMapper = ObjectMapper().registerKotlinModule()
        val login = objectMapper.readValue(request.inputStream, Login::class.java)
        val authRequest = UsernamePasswordAuthenticationToken(login.username, login.password)
        return authenticationManager.authenticate(authRequest)
    }

    private data class Login(
        val username: String?,
        val password: String?
    )
}