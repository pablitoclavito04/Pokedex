package controller;

import service.FavoritoService;
import util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Obtener todos los favoritos del usuario
     * GET /api/favoritos
     */
    @GetMapping
    public ResponseEntity<List<Integer>> obtenerFavoritos(
            @RequestHeader("Authorization") String token) {

        String username = extractUsername(token);
        List<Integer> favoritos = favoritoService.obtenerFavoritos(username);
        return ResponseEntity.ok(favoritos);
    }

    /**
     * Agregar un Pokémon a favoritos
     * POST /api/favoritos/25
     */
    @PostMapping("/{pokemonId}")
    public ResponseEntity<Map<String, Object>> agregarFavorito(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer pokemonId) {

        String username = extractUsername(token);
        favoritoService.agregarFavorito(username, pokemonId);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Pokémon agregado a favoritos",
                "pokemonId", pokemonId,
                "esFavorito", true
        ));
    }

    /**
     * Eliminar un Pokémon de favoritos
     * DELETE /api/favoritos/25
     */
    @DeleteMapping("/{pokemonId}")
    public ResponseEntity<Map<String, Object>> eliminarFavorito(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer pokemonId) {

        String username = extractUsername(token);
        favoritoService.eliminarFavorito(username, pokemonId);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Pokémon eliminado de favoritos",
                "pokemonId", pokemonId,
                "esFavorito", false
        ));
    }

    /**
     * Alternar favorito (toggle)
     * POST /api/favoritos/toggle/25
     */
    @PostMapping("/toggle/{pokemonId}")
    public ResponseEntity<Map<String, Object>> toggleFavorito(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer pokemonId) {

        String username = extractUsername(token);
        boolean esFavorito = favoritoService.toggleFavorito(username, pokemonId);

        return ResponseEntity.ok(Map.of(
                "mensaje", esFavorito ? "Pokémon agregado a favoritos" : "Pokémon eliminado de favoritos",
                "pokemonId", pokemonId,
                "esFavorito", esFavorito
        ));
    }

    /**
     * Verificar si un Pokémon es favorito
     * GET /api/favoritos/check/25
     */
    @GetMapping("/check/{pokemonId}")
    public ResponseEntity<Map<String, Object>> verificarFavorito(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer pokemonId) {

        String username = extractUsername(token);
        boolean esFavorito = favoritoService.esFavorito(username, pokemonId);

        return ResponseEntity.ok(Map.of(
                "pokemonId", pokemonId,
                "esFavorito", esFavorito
        ));
    }

    /**
     * Extraer username del token JWT
     */
    private String extractUsername(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUsername(token);
    }
}
