package repository;

import entity.PokemonTipo;
import entity.PokemonTipoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad PokemonTipo
 */
@Repository
public interface PokemonTipoRepository extends JpaRepository<PokemonTipo, PokemonTipoId> {

    /**
     * Busca los tipos de un Pokémon ordenados por orden (principal primero)
     */
    List<PokemonTipo> findByPokemonIdOrderByOrdenAsc(Integer pokemonId);

    /**
     * Busca todos los Pokémon de un tipo específico
     */
    List<PokemonTipo> findByTipoId(Integer tipoId);

    /**
     * Elimina los tipos de un Pokémon
     */
    void deleteByPokemonId(Integer pokemonId);

    /**
     * Cuenta cuántos tipos tiene un Pokémon
     */
    long countByPokemonId(Integer pokemonId);
}