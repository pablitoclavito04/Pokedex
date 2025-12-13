package security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.Collections;

/**
 * Configuración de Spring Security
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configurar la cadena de seguridad
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (no necesario para APIs REST con JWT)
                .csrf(csrf -> csrf.disable())

                // Configurar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configurar autorización de endpoints
                .authorizeHttpRequests(auth -> auth
                        // Autenticación
                        .requestMatchers("/api/auth/**").permitAll()

                        // GET públicos (sin autenticación)
                        .requestMatchers(HttpMethod.GET, "/api/pokemon").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/numero/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/buscar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/generacion/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/tipo/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tipos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pokemon/{id}/imagen").permitAll()

                        // POST, PUT requieren autenticación (USER o ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/pokemon").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/pokemon/{id}").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/pokemon/{id}/evolucion").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/pokemon/{id}/imagen").hasAnyRole("USER", "ADMIN")

                        // DELETE solo ADMIN
                        .requestMatchers(HttpMethod.DELETE, "/api/pokemon/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/pokemon/{id}/imagen").hasRole("ADMIN")

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
                )

                // Sin gestión de sesiones (stateless para JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Añadir filtro JWT antes del filtro de autenticación
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuración de CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir todos los orígenes (en producción especificar dominios concretos)
        configuration.setAllowedOrigins(Collections.singletonList("*"));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Permitir credenciales
        configuration.setAllowCredentials(false);

        // Aplicar configuración a todos los endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Bean de PasswordEncoder para encriptar contraseñas
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}