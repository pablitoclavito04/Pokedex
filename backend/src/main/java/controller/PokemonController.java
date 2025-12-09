package controller;

import dto.PokemonDTO;
import service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para Pokemon
 */
@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    private final PokemonService pokemonService;

    @Autowired
    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    /**
     * GET /api/pokemon
     */
    @GetMapping
    public ResponseEntity<List<PokemonDTO>> obtenerTodos() {
        return ResponseEntity.ok(pokemonService.obtenerTodos());
    }

    /**
     * GET /api/pokemon/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PokemonDTO> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(pokemonService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/pokemon/numero/{numero}
     */
    @GetMapping("/numero/{numero}")
    public ResponseEntity<PokemonDTO> obtenerPorNumero(@PathVariable Integer numero) {
        try {
            return ResponseEntity.ok(pokemonService.obtenerPorNumero(numero));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/pokemon/buscar?nombre=xxx
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<PokemonDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(pokemonService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/pokemon/generacion/{gen}
     */
    @GetMapping("/generacion/{generacion}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorGeneracion(@PathVariable Integer generacion) {
        return ResponseEntity.ok(pokemonService.obtenerPorGeneracion(generacion));
    }

    /**
     * GET /api/pokemon/tipo/{tipo}
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(pokemonService.obtenerPorTipo(tipo));
    }
}