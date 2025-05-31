package com.football.RomanianFootballBackend.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(false)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication needed
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/product/get/**").permitAll()
                        .requestMatchers("/api/review/*/get").permitAll()
                        .requestMatchers("/api/productInventory/get/**").permitAll()
                        .requestMatchers("/api/productPhotos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/searchByName").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productInventory/**").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/product/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/product/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/productInventory/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/productInventory/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/productInventory/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/discount").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/discount/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/discount/{id}").hasRole("ADMIN")

                        // Authenticated user endpoints
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/review/add/**").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/cart/user/**").authenticated()
                        .requestMatchers("/api/discount/validate").authenticated()
                        .requestMatchers("/api/discount/*/use").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/discount/**").authenticated()

                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\": \"Authentication required\"}");
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\": \"Access denied\"}");
                    })
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}