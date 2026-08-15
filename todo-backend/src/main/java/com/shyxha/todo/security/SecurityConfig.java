package com.shyxha.todo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Allow all our API endpoints without JWT
                // (authentication is handled by checking email param + token on frontend)
                .requestMatchers(
                    "/api/auth/**",
                    "/api/tasks/**",
                    "/api/notes/**",
                    "/api/habits/**",
                    "/api/passwords/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable());  // Disable browser pop-up login

        return http.build();
    }
}
