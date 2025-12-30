package repository;

import entity.Favorito;
import entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {

    List<Favorito> findByUsuarioOrderByFechaAgregadoDesc(User usuario);

    List<Favorito> findByUsuario(User usuario);

    List<Favorito> findByUsuarioId(Integer usuarioId);

    Optional<Favorito> findByUsuarioAndPokemonId(User usuario, Integer pokemonId);

    boolean existsByUsuarioAndPokemonId(User usuario, Integer pokemonId);

    void deleteByUsuarioAndPokemonId(User usuario, Integer pokemonId);
}
