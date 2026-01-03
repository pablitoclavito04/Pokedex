package config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permitir estos orígenes
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:4200",
            "https://localhost:4200",
            "https://pablitoclavito04.github.io"
        ));
        
        // Permitir estos métodos HTTP
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permitir estos headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir credenciales (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Tiempo de caché para preflight requests (1 hora)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}