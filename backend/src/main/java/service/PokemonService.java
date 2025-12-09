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

    private PokemonDTO convertirADTO(Pokemon pokemon) {
        PokemonDTO dto = new PokemonDTO();
        dto.setId(pokemon.getId());
        dto.setNumero(pokemon.getNumero());
        dto.setNombre(pokemon.getNombre());
        dto.setAltura(pokemon.getAltura());
        dto.setPeso(pokemon.getPeso());
        dto.setDescripcion(pokemon.getDescripcion());
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