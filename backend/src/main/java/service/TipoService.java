package service;

import dto.TipoDTO;
import entity.Tipo;
import repository.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para Tipos de Pokémon
 */
@Service
@Transactional
public class TipoService {

    private final TipoRepository tipoRepository;

    @Autowired
    public TipoService(TipoRepository tipoRepository) {
        this.tipoRepository = tipoRepository;
    }

    /**
     * Obtener todos los tipos
     */
    public List<TipoDTO> obtenerTodos() {
        List<Tipo> tipos = tipoRepository.findAll();
        List<TipoDTO> dtos = new ArrayList<>();
        for (Tipo tipo : tipos) {
            dtos.add(convertirADTO(tipo));
        }
        return dtos;
    }

    /**
     * Obtener tipo por ID
     */
    public TipoDTO obtenerPorId(Integer id) {
        Tipo tipo = tipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo no encontrado con id: " + id));
        return convertirADTO(tipo);
    }

    /**
     * Obtener tipo por nombre
     */
    public TipoDTO obtenerPorNombre(String nombre) {
        Tipo tipo = tipoRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Tipo no encontrado: " + nombre));
        return convertirADTO(tipo);
    }

    /**
     * Verificar si un tipo existe
     */
    public boolean existeTipo(Integer id) {
        return tipoRepository.existsById(id);
    }

    private TipoDTO convertirADTO(Tipo tipo) {
        TipoDTO dto = new TipoDTO();
        dto.setId(tipo.getId());
        dto.setNombre(tipo.getNombre());
        dto.setIcono(tipo.getIcono());
        dto.setColor(tipo.getColor());
        return dto;
    }
}