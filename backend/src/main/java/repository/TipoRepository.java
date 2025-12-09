package repository;

import entity.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad Tipo
 */
@Repository
public interface TipoRepository extends JpaRepository<Tipo, Integer> {

    /**
     * Busca un tipo por su nombre
     */
    Optional<Tipo> findByNombre(String nombre);

    /**
     * Verifica si existe un tipo con ese nombre
     */
    boolean existsByNombre(String nombre);

    /**
     * Cuenta cuántos Pokémon tienen este tipo
     */
    @Query("SELECT COUNT(DISTINCT pt.pokemonId) FROM PokemonTipo pt WHERE pt.tipoId = :tipoId")
    long contarPokemonPorTipo(Integer tipoId);
}