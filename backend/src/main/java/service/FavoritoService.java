package service;

import entity.Favorito;
import entity.User;
import repository.FavoritoRepository;
import repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Obtener todos los IDs de Pokémon favoritos de un usuario (ordenados por fecha, más recientes primero)
     */
    public List<Integer> obtenerFavoritos(String username) {
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return favoritoRepository.findByUsuarioOrderByFechaAgregadoDesc(usuario)
                .stream()
                .map(Favorito::getPokemonId)
                .collect(Collectors.toList());
    }

    /**
     * Agregar un Pokémon a favoritos
     */
    public void agregarFavorito(String username, Integer pokemonId) {
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si ya existe
        if (favoritoRepository.existsByUsuarioAndPokemonId(usuario, pokemonId)) {
            throw new RuntimeException("El Pokémon ya está en favoritos");
        }

        Favorito favorito = new Favorito(usuario, pokemonId);
        favoritoRepository.save(favorito);
    }

    /**
     * Eliminar un Pokémon de favoritos
     */
    public void eliminarFavorito(String username, Integer pokemonId) {
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        favoritoRepository.deleteByUsuarioAndPokemonId(usuario, pokemonId);
    }

    /**
     * Verificar si un Pokémon es favorito
     */
    public boolean esFavorito(String username, Integer pokemonId) {
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return favoritoRepository.existsByUsuarioAndPokemonId(usuario, pokemonId);
    }

    /**
     * Alternar favorito (agregar si no existe, eliminar si existe)
     */
    public boolean toggleFavorito(String username, Integer pokemonId) {
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (favoritoRepository.existsByUsuarioAndPokemonId(usuario, pokemonId)) {
            favoritoRepository.deleteByUsuarioAndPokemonId(usuario, pokemonId);
            return false; // Ya no es favorito
        } else {
            Favorito favorito = new Favorito(usuario, pokemonId);
            favoritoRepository.save(favorito);
            return true; // Ahora es favorito
        }
    }
}
