package controller;

import dto.TipoDTO;
import service.TipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para Tipos de Pokémon
 */
@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoController {

    private final TipoService tipoService;

    @Autowired
    public TipoController(TipoService tipoService) {
        this.tipoService = tipoService;
    }

    /**
     * GET /api/tipos
     * Obtener todos los tipos
     */
    @GetMapping
    public ResponseEntity<List<TipoDTO>> obtenerTodos() {
        return ResponseEntity.ok(tipoService.obtenerTodos());
    }

    /**
     * GET /api/tipos/{id}
     * Obtener tipo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipoDTO> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(tipoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/tipos/nombre/{nombre}
     * Obtener tipo por nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<TipoDTO> obtenerPorNombre(@PathVariable String nombre) {
        try {
            return ResponseEntity.ok(tipoService.obtenerPorNombre(nombre));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}