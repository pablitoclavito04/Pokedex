package repository;

import entity.Estadisticas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Estadisticas
 */
@Repository
public interface EstadisticasRepository extends JpaRepository<Estadisticas, Integer> {

    /**
     * Busca estadísticas por ID del Pokémon
     */
    Optional<Estadisticas> findByIdPokemon(Integer idPokemon);

    /**
     * Busca Pokémon con PS mayor o igual al valor especificado
     */
    List<Estadisticas> findByPsGreaterThanEqualOrderByPsDesc(Integer ps);

    /**
     * Top Pokémon por estadística específica
     */
    List<Estadisticas> findTop10ByOrderByPsDesc();
    List<Estadisticas> findTop10ByOrderByAtaqueDesc();
    List<Estadisticas> findTop10ByOrderByDefensaDesc();
    List<Estadisticas> findTop10ByOrderByVelocidadDesc();

    /**
     * Encuentra Pokémon con total de estadísticas mayor a un valor
     */
    @Query("SELECT e FROM Estadisticas e " +
            "WHERE (e.ps + e.ataque + e.defensa + e.velocidad + e.ataqueEspecial + e.defensaEspecial) >= :total " +
            "ORDER BY (e.ps + e.ataque + e.defensa + e.velocidad + e.ataqueEspecial + e.defensaEspecial) DESC")
    List<Estadisticas> findByTotalEstadisticasGreaterThan(Integer total);
}
