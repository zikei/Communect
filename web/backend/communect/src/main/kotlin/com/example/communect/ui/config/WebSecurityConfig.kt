package com.example.communect.ui.config

import com.example.communect.app.service.CustomUserDetailsService
import com.example.communect.ui.config.filter.ApiKeyAuthFilter
import com.example.communect.ui.config.filter.CustomAuthenticationFilter
import com.example.communect.ui.config.handler.CustomAccessDeniedHandler
import com.example.communect.ui.config.handler.CustomAuthenticationFailureHandler
import com.example.communect.ui.config.handler.CustomAuthenticationSuccessHandler
import com.example.communect.ui.config.handler.CustomLogoutSuccessHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.security.servlet.PathRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod.POST
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.context.DelegatingSecurityContextRepository
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
class WebSecurityConfig(
    @Autowired val apiKeyAuthFilter: ApiKeyAuthFilter,
    @Autowired val customAuthenticationEntryPoint: CustomAuthenticationEntryPoint,
    @Autowired val customAccessDeniedHandler: CustomAccessDeniedHandler,
    @Autowired val customUserDetailsService: CustomUserDetailsService
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain? {
        http {
            authorizeHttpRequests {
                authorize(PathRequest.toStaticResources().atCommonLocations(), permitAll)
                authorize(POST,"/user", permitAll)
                authorize(anyRequest, authenticated)
            }

            addFilterBefore<UsernamePasswordAuthenticationFilter>(apikeyAuthFilter())
            addFilterAt<UsernamePasswordAuthenticationFilter>(customAuthenticationFilter())

            exceptionHandling {
                authenticationEntryPoint = customAuthenticationEntryPoint
                accessDeniedHandler = customAccessDeniedHandler
            }

            logout {
                logoutUrl = "/logout"
                logoutSuccessHandler = customLogoutSuccessHandler()
            }
            csrf {
                disable()
            }
            cors {  }
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.IF_REQUIRED
            }
        }
        return http.build()
    }

    @Bean
    fun apikeyAuthFilter(): ApiKeyAuthFilter {
        return apiKeyAuthFilter
    }

    @Bean
    fun customAuthenticationFilter(): CustomAuthenticationFilter {
        val filter = CustomAuthenticationFilter()
        filter.setAuthenticationManager(authenticationManager(
            customUserDetailsService,
            passwordEncoder()
        ))
        filter.setFilterProcessesUrl("/login")
        filter.setAuthenticationSuccessHandler(customAuthenticationSuccessHandler())
        filter.setAuthenticationFailureHandler(customAuthenticationFailureHandler())
        filter.setSecurityContextRepository(securityContextRepository())

        return filter
    }

    @Bean
    fun customAuthenticationSuccessHandler(): CustomAuthenticationSuccessHandler {
        return  CustomAuthenticationSuccessHandler()
    }

    @Bean
    fun customAuthenticationFailureHandler(): CustomAuthenticationFailureHandler {
        return  CustomAuthenticationFailureHandler()
    }

    @Bean
    fun customLogoutSuccessHandler(): CustomLogoutSuccessHandler {
        return  CustomLogoutSuccessHandler()
    }

    @Bean
    fun authenticationManager(
        userDetailsService: UserDetailsService,
        passwordEncoder: PasswordEncoder
    ): AuthenticationManager {
        val authenticationProvider = DaoAuthenticationProvider()
        authenticationProvider.setUserDetailsService(userDetailsService)
        authenticationProvider.setPasswordEncoder(passwordEncoder)
        return ProviderManager(authenticationProvider)
    }

    @Bean
    fun securityContextRepository(): SecurityContextRepository {
        return DelegatingSecurityContextRepository(
            HttpSessionSecurityContextRepository(),
            RequestAttributeSecurityContextRepository()
        )
    }

    @Bean
    fun corsConfigurationSource(
        @Value("\${frontFQDN}") front: String
    ): UrlBasedCorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://${front}", "https://${front}")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        configuration.exposedHeaders = listOf("*")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}