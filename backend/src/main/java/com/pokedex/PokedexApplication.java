package com.pokedex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * ACTUALIZACIÓN: Añadir "config" a scanBasePackages
 */
@SpringBootApplication(scanBasePackages = {
        "com.pokedex",
        "controller",
        "service",
        "repository",
        "entity",
        "dto",
        "security",
        "util",
        "config"  // <-- AÑADIR ESTA LÍNEA
})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = {"entity"})
public class PokedexApplication {

    public static void main(String[] args) {
        SpringApplication.run(PokedexApplication.class, args);

        System.out.println("\n" +
                "╔════════════════════════════════════════════════════════╗\n" +
                "║                                                        ║\n" +
                "║           POKÉDEX BACKEND API INICIADA                 ║\n" +
                "║     http://localhost:8080/api/pokemon                  ║\n" +
                "║                                                        ║\n" +
                "╚════════════════════════════════════════════════════════╝\n");
    }
}