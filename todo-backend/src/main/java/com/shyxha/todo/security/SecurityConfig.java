package com.shyxha.todo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Allow API endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/tasks/**",
                                "/api/notes/**",
                                "/api/habits/**",
                                "/api/passwords/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}

