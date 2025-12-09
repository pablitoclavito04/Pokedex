package repository;

import entity.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Pokemon
 * Proporciona métodos CRUD y consultas personalizadas
 */
@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Integer> {

    /**
     * Busca un Pokémon por su número de Pokédex
     */
    Optional<Pokemon> findByNumero(Integer numero);

    /**
     * Busca Pokémon por nombre (case insensitive)
     */
    List<Pokemon> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca Pokémon por generación
     */
    List<Pokemon> findByGeneracion(Integer generacion);

    /**
     * Busca Pokémon por generación ordenados por número
     */
    List<Pokemon> findByGeneracionOrderByNumeroAsc(Integer generacion);

    /**
     * Obtiene todos los Pokémon ordenados por número
     */
    List<Pokemon> findAllByOrderByNumeroAsc();

    /**
     * Verifica si existe un Pokémon con ese número
     */
    boolean existsByNumero(Integer numero);

    /**
     * Busca Pokémon por tipo
     */
    @Query("SELECT DISTINCT p FROM Pokemon p " +
            "JOIN PokemonTipo pt ON p.id = pt.pokemonId " +
            "JOIN Tipo t ON pt.tipoId = t.id " +
            "WHERE t.nombre = :nombreTipo " +
            "ORDER BY p.numero")
    List<Pokemon> findByTipo(@Param("nombreTipo") String nombreTipo);

    /**
     * Busca Pokémon que tengan dos tipos específicos
     */
    @Query("SELECT p FROM Pokemon p " +
            "WHERE EXISTS (SELECT 1 FROM PokemonTipo pt1 JOIN Tipo t1 ON pt1.tipoId = t1.id " +
            "              WHERE pt1.pokemonId = p.id AND t1.nombre = :tipo1) " +
            "AND EXISTS (SELECT 1 FROM PokemonTipo pt2 JOIN Tipo t2 ON pt2.tipoId = t2.id " +
            "            WHERE pt2.pokemonId = p.id AND t2.nombre = :tipo2) " +
            "ORDER BY p.numero")
    List<Pokemon> findByDosTipos(@Param("tipo1") String tipo1, @Param("tipo2") String tipo2);

    /**
     * Cuenta Pokémon por generación
     */
    long countByGeneracion(Integer generacion);
}