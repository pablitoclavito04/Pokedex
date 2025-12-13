package service;

import config.FileStorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Servicio para gestión de archivos
 */
@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        // Crear directorio de almacenamiento
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento", ex);
        }
    }

    /**
     * Guardar imagen de Pokémon
     */
    public String storeFile(MultipartFile file, Integer pokemonId) {
        // Validar archivo
        if (file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        // Validar que sea imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("El archivo debe ser una imagen (PNG, JPG, JPEG, GIF)");
        }

        // Obtener extensión
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";

        if (originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Validar extensión
        if (!fileExtension.matches("\\.(jpg|jpeg|png|gif)$")) {
            throw new RuntimeException("Solo se permiten archivos JPG, JPEG, PNG o GIF");
        }

        // Nombre del archivo: pokemon_{id}.{ext}
        String fileName = "pokemon_" + pokemonId + fileExtension;

        try {
            // Verificar path traversal
            if (fileName.contains("..")) {
                throw new RuntimeException("Nombre de archivo inválido: " + fileName);
            }

            // Copiar archivo al directorio
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Error al guardar el archivo: " + fileName, ex);
        }
    }

    /**
     * Cargar archivo
     */
    public Path loadFile(String fileName) {
        return fileStorageLocation.resolve(fileName).normalize();
    }

    /**
     * Eliminar archivo
     */
    public void deleteFile(String fileName) {
        try {
            Path filePath = loadFile(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Error al eliminar el archivo: " + fileName, ex);
        }
    }

    /**
     * Verificar si existe archivo
     */
    public boolean fileExists(String fileName) {
        Path filePath = loadFile(fileName);
        return Files.exists(filePath);
    }

    /**
     * Obtener nombre de archivo para un Pokémon (busca cualquier extensión)
     */
    public String getFileNameForPokemon(Integer pokemonId) {
        String[] extensions = {".png", ".jpg", ".jpeg", ".gif"};

        for (String ext : extensions) {
            String fileName = "pokemon_" + pokemonId + ext;
            if (fileExists(fileName)) {
                return fileName;
            }
        }

        return null;
    }
}