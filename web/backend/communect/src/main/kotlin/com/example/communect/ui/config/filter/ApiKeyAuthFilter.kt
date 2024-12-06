package com.example.communect.ui.config.filter

import com.example.communect.app.service.CustomUserDetailsService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken
import org.springframework.web.filter.OncePerRequestFilter

@Configuration
class ApiKeyAuthFilter(
    @Value("\${apikeyHeaderName}") private val headerName: String,
    private val apiKeyService: CustomUserDetailsService
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val apikey = request.getHeader(headerName)

        if (apikey != null) {
            val userDetails = apiKeyService.loadUserByApiKey(apikey)
            if (userDetails != null) {
                val context: SecurityContext = SecurityContextHolder.createEmptyContext()
                val authentication: Authentication = PreAuthenticatedAuthenticationToken(
                    userDetails, null, userDetails.authorities
                )
                context.authentication = authentication
                SecurityContextHolder.setContext(context)
            }
        }

        filterChain.doFilter(request, response)
    }
}