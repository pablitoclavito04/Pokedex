package repository;

import entity.Evolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Evolucion
 */
@Repository
public interface EvolucionRepository extends JpaRepository<Evolucion, Integer> {

    /**
     * Busca las evoluciones de un Pokémon (en qué puede evolucionar)
     */
    List<Evolucion> findByPokemonOrigenId(Integer pokemonOrigenId);

    /**
     * Busca las pre-evoluciones de un Pokémon (de qué evolucionó)
     */
    List<Evolucion> findByPokemonDestinoId(Integer pokemonDestinoId);

    /**
     * Busca la cadena evolutiva completa de un Pokémon
     */
    @Query("SELECT e FROM Evolucion e WHERE e.pokemonOrigenId = :pokemonId OR e.pokemonDestinoId = :pokemonId")
    List<Evolucion> findCadenaEvolutiva(@Param("pokemonId") Integer pokemonId);

    /**
     * Verifica si un Pokémon tiene evolución
     */
    boolean existsByPokemonOrigenId(Integer pokemonOrigenId);

    /**
     * Verifica si un Pokémon es una evolución de otro
     */
    boolean existsByPokemonDestinoId(Integer pokemonDestinoId);

    /**
     * Busca evoluciones por método
     */
    List<Evolucion> findByMetodoContainingIgnoreCase(String metodo);
}