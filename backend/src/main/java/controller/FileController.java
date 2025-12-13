package controller;

import service.FileStorageService;
import service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Controlador para gestión de archivos (imágenes de Pokémon)
 */
@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PokemonService pokemonService;

    /**
     * Subir imagen de un Pokémon
     * POST /api/pokemon/{id}/imagen
     * Requiere autenticación (USER o ADMIN)
     */
    @PostMapping("/{id}/imagen")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> uploadImage(@PathVariable Integer id,
                                         @RequestParam("file") MultipartFile file) {
        try {
            // Verificar que el Pokémon existe
            pokemonService.obtenerPorId(id);

            // Guardar archivo
            String fileName = fileStorageService.storeFile(file, id);

            // Actualizar URL en el Pokémon
            String imageUrl = "/api/pokemon/" + id + "/imagen";
            pokemonService.actualizarImagenUrl(id, imageUrl);

            return ResponseEntity.ok("Imagen subida exitosamente: " + fileName);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error al subir imagen: " + e.getMessage());
        }
    }

    /**
     * Descargar/Ver imagen de un Pokémon
     * GET /api/pokemon/{id}/imagen
     * Público (sin autenticación)
     */
    @GetMapping("/{id}/imagen")
    public ResponseEntity<?> downloadImage(@PathVariable Integer id) {
        try {
            // Buscar archivo del Pokémon
            String fileName = fileStorageService.getFileNameForPokemon(id);

            if (fileName == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("El Pokémon no tiene imagen");
            }

            // Cargar archivo
            Path filePath = fileStorageService.loadFile(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Imagen no encontrada");
            }

            // Determinar tipo de contenido
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Retornar imagen
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cargar imagen: " + e.getMessage());
        }
    }

    /**
     * Eliminar imagen de un Pokémon
     * DELETE /api/pokemon/{id}/imagen
     * Solo ADMIN
     */
    @DeleteMapping("/{id}/imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable Integer id) {
        try {
            // Verificar que el Pokémon existe
            pokemonService.obtenerPorId(id);

            // Buscar archivo
            String fileName = fileStorageService.getFileNameForPokemon(id);

            if (fileName == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("El Pokémon no tiene imagen");
            }

            // Eliminar archivo
            fileStorageService.deleteFile(fileName);

            // Actualizar URL en el Pokémon (null)
            pokemonService.actualizarImagenUrl(id, null);

            return ResponseEntity.ok("Imagen eliminada exitosamente");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error al eliminar imagen: " + e.getMessage());
        }
    }
}