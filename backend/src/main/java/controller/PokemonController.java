package controller;

import dto.PokemonDTO;
import service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para Pokemon con CRUD completo
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

    // ==================== READ ====================

    /**
     * GET /api/pokemon
     * Obtener todos los Pokémon
     */
    @GetMapping
    public ResponseEntity<List<PokemonDTO>> obtenerTodos() {
        return ResponseEntity.ok(pokemonService.obtenerTodos());
    }

    /**
     * GET /api/pokemon/{id}
     * Obtener Pokémon por ID
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
     * Obtener Pokémon por número de Pokédex
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
     * Buscar Pokémon por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<PokemonDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(pokemonService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/pokemon/generacion/{gen}
     * Obtener Pokémon por generación
     */
    @GetMapping("/generacion/{generacion}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorGeneracion(@PathVariable Integer generacion) {
        return ResponseEntity.ok(pokemonService.obtenerPorGeneracion(generacion));
    }

    /**
     * GET /api/pokemon/tipo/{tipo}
     * Obtener Pokémon por tipo
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(pokemonService.obtenerPorTipo(tipo));
    }

    // ==================== CREATE ====================

    /**
     * POST /api/pokemon
     * Crear un nuevo Pokémon
     *
     * Body JSON ejemplo:
     * {
     *   "numero": 6,
     *   "nombre": "Charizard",
     *   "altura": 1.70,
     *   "peso": 90.50,
     *   "descripcion": "Escupe fuego que es tan caliente...",
     *   "generacion": 1,
     *   "tipos": ["Fuego", "Volador"],
     *   "estadisticas": {
     *     "ps": 78,
     *     "ataque": 84,
     *     "defensa": 78,
     *     "velocidad": 100,
     *     "ataqueEspecial": 109,
     *     "defensaEspecial": 85
     *   }
     * }
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PokemonDTO pokemonDTO) {
        try {
            PokemonDTO creado = pokemonService.crear(pokemonDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== UPDATE ====================

    /**
     * PUT /api/pokemon/{id}
     * Actualizar un Pokémon existente
     *
     * Body JSON ejemplo (solo incluir campos a actualizar):
     * {
     *   "nombre": "Charizard Shiny",
     *   "peso": 91.00,
     *   "descripcion": "Nueva descripción..."
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody PokemonDTO pokemonDTO) {
        try {
            PokemonDTO actualizado = pokemonService.actualizar(id, pokemonDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== DELETE ====================

    /**
     * DELETE /api/pokemon/{id}
     * Eliminar un Pokémon
     * Elimina automáticamente: estadísticas, tipos y evoluciones
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            pokemonService.eliminar(id);
            return ResponseEntity.ok("Pokémon eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== LÓGICA DE NEGOCIO ====================

    /**
     * POST /api/pokemon/{origenId}/evolucion
     * Crear una evolución
     *
     * Body JSON ejemplo:
     * {
     *   "destinoId": 2,
     *   "nivel": 16,
     *   "metodo": "Nivel"
     * }
     */
    @PostMapping("/{origenId}/evolucion")
    public ResponseEntity<?> crearEvolucion(
            @PathVariable Integer origenId,
            @RequestBody EvolucionRequest request) {
        try {
            pokemonService.crearEvolucion(
                    origenId,
                    request.getDestinoId(),
                    request.getNivel(),
                    request.getMetodo()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body("Evolución creada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Clase auxiliar para request de evolución
    public static class EvolucionRequest {
        private Integer destinoId;
        private Integer nivel;
        private String metodo;

        public Integer getDestinoId() {
            return destinoId;
        }

        public void setDestinoId(Integer destinoId) {
            this.destinoId = destinoId;
        }

        public Integer getNivel() {
            return nivel;
        }

        public void setNivel(Integer nivel) {
            this.nivel = nivel;
        }

        public String getMetodo() {
            return metodo;
        }

        public void setMetodo(String metodo) {
            this.metodo = metodo;
        }
    }
}