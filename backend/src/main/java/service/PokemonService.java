package service;

import dto.*;
import entity.*;
import repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para Pokemon con CRUD completo y lógica de negocio
 * ACTUALIZADO con soporte para imágenes
 */
@Service
@Transactional
public class PokemonService {

    private final PokemonRepository pokemonRepository;
    private final PokemonTipoRepository pokemonTipoRepository;
    private final EstadisticasRepository estadisticasRepository;
    private final EvolucionRepository evolucionRepository;
    private final TipoRepository tipoRepository;

    @Autowired
    public PokemonService(PokemonRepository pokemonRepository,
                          PokemonTipoRepository pokemonTipoRepository,
                          EstadisticasRepository estadisticasRepository,
                          EvolucionRepository evolucionRepository,
                          TipoRepository tipoRepository) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonTipoRepository = pokemonTipoRepository;
        this.estadisticasRepository = estadisticasRepository;
        this.evolucionRepository = evolucionRepository;
        this.tipoRepository = tipoRepository;
    }

    // ==================== READ ====================

    public List<PokemonDTO> obtenerTodos() {
        List<Pokemon> pokemonList = pokemonRepository.findAllByOrderByNumeroAsc();
        List<PokemonDTO> dtoList = new ArrayList<>();
        for (Pokemon pokemon : pokemonList) {
            dtoList.add(convertirADTO(pokemon));
        }
        return dtoList;
    }

    public PokemonDTO obtenerPorId(Integer id) {
        Optional<Pokemon> pokemonOpt = pokemonRepository.findById(id);
        if (!pokemonOpt.isPresent()) {
            throw new RuntimeException("Pokemon no encontrado con id: " + id);
        }
        return convertirADTO(pokemonOpt.get());
    }

    public PokemonDTO obtenerPorNumero(Integer numero) {
        Optional<Pokemon> pokemonOpt = pokemonRepository.findByNumero(numero);
        if (!pokemonOpt.isPresent()) {
            throw new RuntimeException("Pokemon no encontrado con numero: " + numero);
        }
        return convertirADTO(pokemonOpt.get());
    }

    public List<PokemonDTO> buscarPorNombre(String nombre) {
        List<Pokemon> pokemonList = pokemonRepository.findByNombreContainingIgnoreCase(nombre);
        List<PokemonDTO> dtoList = new ArrayList<>();
        for (Pokemon pokemon : pokemonList) {
            dtoList.add(convertirADTO(pokemon));
        }
        return dtoList;
    }

    public List<PokemonDTO> obtenerPorGeneracion(Integer generacion) {
        List<Pokemon> pokemonList = pokemonRepository.findByGeneracionOrderByNumeroAsc(generacion);
        List<PokemonDTO> dtoList = new ArrayList<>();
        for (Pokemon pokemon : pokemonList) {
            dtoList.add(convertirADTO(pokemon));
        }
        return dtoList;
    }

    public List<PokemonDTO> obtenerPorTipo(String nombreTipo) {
        List<Pokemon> pokemonList = pokemonRepository.findByTipo(nombreTipo);
        List<PokemonDTO> dtoList = new ArrayList<>();
        for (Pokemon pokemon : pokemonList) {
            dtoList.add(convertirADTO(pokemon));
        }
        return dtoList;
    }

    // ==================== CREATE ====================

    /**
     * Crear un nuevo Pokémon
     * Lógica de negocio:
     * - No permitir duplicados (mismo número de Pokédex)
     * - Validar que tenga al menos 1 tipo y máximo 2
     * - Validar que la generación sea 1-9
     * - Validar que los tipos existan
     */
    public PokemonDTO crear(PokemonDTO dto) {
        // Validación 1: No duplicados por número
        if (pokemonRepository.findByNumero(dto.getNumero()).isPresent()) {
            throw new RuntimeException("Ya existe un Pokémon con el número " + dto.getNumero());
        }

        // Validación 2: Debe tener al menos 1 tipo y máximo 2
        if (dto.getTipos() == null || dto.getTipos().isEmpty()) {
            throw new RuntimeException("El Pokémon debe tener al menos un tipo");
        }
        if (dto.getTipos().size() > 2) {
            throw new RuntimeException("El Pokémon no puede tener más de 2 tipos");
        }

        // Validación 3: Generación entre 1 y 9
        if (dto.getGeneracion() == null || dto.getGeneracion() < 1 || dto.getGeneracion() > 9) {
            throw new RuntimeException("La generación debe estar entre 1 y 9");
        }

        // Validación 4: Los tipos deben existir
        for (String nombreTipo : dto.getTipos()) {
            if (!tipoRepository.findByNombre(nombreTipo).isPresent()) {
                throw new RuntimeException("El tipo '" + nombreTipo + "' no existe");
            }
        }

        // Crear Pokemon
        Pokemon pokemon = new Pokemon();
        pokemon.setNumero(dto.getNumero());
        pokemon.setNombre(dto.getNombre());
        pokemon.setAltura(dto.getAltura());
        pokemon.setPeso(dto.getPeso());
        pokemon.setDescripcion(dto.getDescripcion());
        pokemon.setGeneracion(dto.getGeneracion());

        Pokemon savedPokemon = pokemonRepository.save(pokemon);

        // Crear relaciones Pokemon-Tipo
        byte orden = 1;
        for (String nombreTipo : dto.getTipos()) {
            Tipo tipo = tipoRepository.findByNombre(nombreTipo).get();

            PokemonTipo pokemonTipo = new PokemonTipo();
            pokemonTipo.setPokemonId(savedPokemon.getId());
            pokemonTipo.setTipoId(tipo.getId());
            pokemonTipo.setOrden(orden);

            pokemonTipoRepository.save(pokemonTipo);
            orden++;
        }

        // Crear estadísticas si se proporcionan
        if (dto.getEstadisticas() != null) {
            validarEstadisticas(dto.getEstadisticas());

            Estadisticas stats = new Estadisticas();
            stats.setIdPokemon(savedPokemon.getId());
            stats.setPs(dto.getEstadisticas().getPs());
            stats.setAtaque(dto.getEstadisticas().getAtaque());
            stats.setDefensa(dto.getEstadisticas().getDefensa());
            stats.setVelocidad(dto.getEstadisticas().getVelocidad());
            stats.setAtaqueEspecial(dto.getEstadisticas().getAtaqueEspecial());
            stats.setDefensaEspecial(dto.getEstadisticas().getDefensaEspecial());

            estadisticasRepository.save(stats);
        }

        return convertirADTO(savedPokemon);
    }

    // ==================== UPDATE ====================

    /**
     * Actualizar un Pokémon existente
     */
    public PokemonDTO actualizar(Integer id, PokemonDTO dto) {
        Pokemon pokemon = pokemonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pokemon no encontrado con id: " + id));

        // Validar número único (si cambió)
        if (!pokemon.getNumero().equals(dto.getNumero())) {
            if (pokemonRepository.findByNumero(dto.getNumero()).isPresent()) {
                throw new RuntimeException("Ya existe un Pokémon con el número " + dto.getNumero());
            }
            pokemon.setNumero(dto.getNumero());
        }

        // Validar generación
        if (dto.getGeneracion() != null) {
            if (dto.getGeneracion() < 1 || dto.getGeneracion() > 9) {
                throw new RuntimeException("La generación debe estar entre 1 y 9");
            }
            pokemon.setGeneracion(dto.getGeneracion());
        }

        // Actualizar campos básicos
        if (dto.getNombre() != null) pokemon.setNombre(dto.getNombre());
        if (dto.getAltura() != null) pokemon.setAltura(dto.getAltura());
        if (dto.getPeso() != null) pokemon.setPeso(dto.getPeso());
        if (dto.getDescripcion() != null) pokemon.setDescripcion(dto.getDescripcion());

        Pokemon updatedPokemon = pokemonRepository.save(pokemon);

        // Actualizar tipos si se proporcionan
        if (dto.getTipos() != null && !dto.getTipos().isEmpty()) {
            if (dto.getTipos().size() > 2) {
                throw new RuntimeException("El Pokémon no puede tener más de 2 tipos");
            }

            // Eliminar tipos anteriores
            pokemonTipoRepository.deleteByPokemonId(id);

            // Crear nuevos tipos
            byte orden = 1;
            for (String nombreTipo : dto.getTipos()) {
                Tipo tipo = tipoRepository.findByNombre(nombreTipo)
                        .orElseThrow(() -> new RuntimeException("El tipo '" + nombreTipo + "' no existe"));

                PokemonTipo pokemonTipo = new PokemonTipo();
                pokemonTipo.setPokemonId(id);
                pokemonTipo.setTipoId(tipo.getId());
                pokemonTipo.setOrden(orden);

                pokemonTipoRepository.save(pokemonTipo);
                orden++;
            }
        }

        // Actualizar estadísticas si se proporcionan
        if (dto.getEstadisticas() != null) {
            validarEstadisticas(dto.getEstadisticas());

            Optional<Estadisticas> statsOpt = estadisticasRepository.findByIdPokemon(id);
            Estadisticas stats;

            if (statsOpt.isPresent()) {
                stats = statsOpt.get();
            } else {
                stats = new Estadisticas();
                stats.setIdPokemon(id);
            }

            stats.setPs(dto.getEstadisticas().getPs());
            stats.setAtaque(dto.getEstadisticas().getAtaque());
            stats.setDefensa(dto.getEstadisticas().getDefensa());
            stats.setVelocidad(dto.getEstadisticas().getVelocidad());
            stats.setAtaqueEspecial(dto.getEstadisticas().getAtaqueEspecial());
            stats.setDefensaEspecial(dto.getEstadisticas().getDefensaEspecial());

            estadisticasRepository.save(stats);
        }

        return convertirADTO(updatedPokemon);
    }

    // ==================== DELETE ====================

    /**
     * Eliminar un Pokémon
     * Lógica de negocio:
     * - Eliminar automáticamente estadísticas, tipos y evoluciones
     */
    public void eliminar(Integer id) {
        if (!pokemonRepository.existsById(id)) {
            throw new RuntimeException("Pokemon no encontrado con id: " + id);
        }

        // Eliminar evoluciones donde este Pokémon es origen o destino
        List<Evolucion> evolucionesOrigen = evolucionRepository.findByPokemonOrigenId(id);
        for (Evolucion ev : evolucionesOrigen) {
            evolucionRepository.delete(ev);
        }

        List<Evolucion> evolucionesDestino = evolucionRepository.findByPokemonDestinoId(id);
        for (Evolucion ev : evolucionesDestino) {
            evolucionRepository.delete(ev);
        }

        // Eliminar estadísticas
        Optional<Estadisticas> stats = estadisticasRepository.findByIdPokemon(id);
        if (stats.isPresent()) {
            estadisticasRepository.delete(stats.get());
        }

        // Eliminar tipos
        pokemonTipoRepository.deleteByPokemonId(id);

        // Eliminar Pokémon
        pokemonRepository.deleteById(id);
    }

    // ==================== FILE MANAGEMENT ====================

    /**
     * Actualizar URL de imagen de un Pokémon
     * NUEVO MÉTODO para soporte de imágenes
     */
    public void actualizarImagenUrl(Integer id, String imagenUrl) {
        Pokemon pokemon = pokemonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pokemon no encontrado con id: " + id));

        pokemon.setImagenUrl(imagenUrl);
        pokemonRepository.save(pokemon);
    }

    // ==================== LÓGICA DE NEGOCIO ====================

    /**
     * Crear evolución
     * Validación: Un Pokémon no puede evolucionar a sí mismo
     */
    public void crearEvolucion(Integer origenId, Integer destinoId, Integer nivel, String metodo) {
        if (origenId.equals(destinoId)) {
            throw new RuntimeException("Un Pokémon no puede evolucionar a sí mismo");
        }

        if (!pokemonRepository.existsById(origenId)) {
            throw new RuntimeException("Pokémon origen no existe");
        }

        if (!pokemonRepository.existsById(destinoId)) {
            throw new RuntimeException("Pokémon destino no existe");
        }

        Evolucion evolucion = new Evolucion();
        evolucion.setPokemonOrigenId(origenId);
        evolucion.setPokemonDestinoId(destinoId);
        evolucion.setNivelEvolucion(nivel);
        evolucion.setMetodo(metodo);

        evolucionRepository.save(evolucion);
    }

    /**
     * Validar estadísticas
     * Las stats deben estar entre 1 y 255
     */
    private void validarEstadisticas(EstadisticasDTO stats) {
        if (stats.getPs() < 1 || stats.getPs() > 255) {
            throw new RuntimeException("Los PS deben estar entre 1 y 255");
        }
        if (stats.getAtaque() < 1 || stats.getAtaque() > 255) {
            throw new RuntimeException("El Ataque debe estar entre 1 y 255");
        }
        if (stats.getDefensa() < 1 || stats.getDefensa() > 255) {
            throw new RuntimeException("La Defensa debe estar entre 1 y 255");
        }
        if (stats.getVelocidad() < 1 || stats.getVelocidad() > 255) {
            throw new RuntimeException("La Velocidad debe estar entre 1 y 255");
        }
        if (stats.getAtaqueEspecial() < 1 || stats.getAtaqueEspecial() > 255) {
            throw new RuntimeException("El Ataque Especial debe estar entre 1 y 255");
        }
        if (stats.getDefensaEspecial() < 1 || stats.getDefensaEspecial() > 255) {
            throw new RuntimeException("La Defensa Especial debe estar entre 1 y 255");
        }
    }

    // ==================== CONVERSIÓN ====================

    /**
     * Convertir entidad Pokemon a DTO
     * ACTUALIZADO para incluir imagenUrl
     */
    private PokemonDTO convertirADTO(Pokemon pokemon) {
        PokemonDTO dto = new PokemonDTO();
        dto.setId(pokemon.getId());
        dto.setNumero(pokemon.getNumero());
        dto.setNombre(pokemon.getNombre());
        dto.setAltura(pokemon.getAltura());
        dto.setPeso(pokemon.getPeso());
        dto.setDescripcion(pokemon.getDescripcion());
        dto.setImagenUrl(pokemon.getImagenUrl());  // AÑADIDO
        dto.setGeneracion(pokemon.getGeneracion());

        // Obtener tipos
        List<PokemonTipo> pokemonTipos = pokemonTipoRepository.findByPokemonIdOrderByOrdenAsc(pokemon.getId());
        List<String> tipos = new ArrayList<>();
        for (PokemonTipo pt : pokemonTipos) {
            Optional<Tipo> tipoOpt = tipoRepository.findById(pt.getTipoId());
            if (tipoOpt.isPresent()) {
                tipos.add(tipoOpt.get().getNombre());
            }
        }
        dto.setTipos(tipos);

        // Obtener estadísticas
        Optional<Estadisticas> statsOpt = estadisticasRepository.findByIdPokemon(pokemon.getId());
        if (statsOpt.isPresent()) {
            Estadisticas stats = statsOpt.get();
            EstadisticasDTO statsDTO = new EstadisticasDTO();
            statsDTO.setId(stats.getId());
            statsDTO.setPs(stats.getPs());
            statsDTO.setAtaque(stats.getAtaque());
            statsDTO.setDefensa(stats.getDefensa());
            statsDTO.setVelocidad(stats.getVelocidad());
            statsDTO.setAtaqueEspecial(stats.getAtaqueEspecial());
            statsDTO.setDefensaEspecial(stats.getDefensaEspecial());
            statsDTO.setTotal(stats.calcularTotal());
            dto.setEstadisticas(statsDTO);
        }

        // Obtener evoluciones
        List<Evolucion> evoluciones = evolucionRepository.findByPokemonOrigenId(pokemon.getId());
        List<EvolucionDTO> evolucionDTOs = new ArrayList<>();
        for (Evolucion ev : evoluciones) {
            EvolucionDTO evDTO = new EvolucionDTO();
            evDTO.setId(ev.getId());
            evDTO.setPokemonOrigen(pokemon.getNombre());

            Optional<Pokemon> pokemonDestinoOpt = pokemonRepository.findById(ev.getPokemonDestinoId());
            if (pokemonDestinoOpt.isPresent()) {
                evDTO.setPokemonDestino(pokemonDestinoOpt.get().getNombre());
            }

            evDTO.setNivelEvolucion(ev.getNivelEvolucion());
            evDTO.setMetodo(ev.getMetodo());
            evolucionDTOs.add(evDTO);
        }
        dto.setEvoluciones(evolucionDTOs);

        return dto;
    }
}