package entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clase de clave compuesta para PokemonTipo
 */
public class PokemonTipoId implements Serializable {
    private Integer pokemonId;
    private Integer tipoId;

    public PokemonTipoId() {}

    public PokemonTipoId(Integer pokemonId, Integer tipoId) {
        this.pokemonId = pokemonId;
        this.tipoId = tipoId;
    }

    public Integer getPokemonId() {
        return pokemonId;
    }

    public void setPokemonId(Integer pokemonId) {
        this.pokemonId = pokemonId;
    }

    public Integer getTipoId() {
        return tipoId;
    }

    public void setTipoId(Integer tipoId) {
        this.tipoId = tipoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PokemonTipoId that = (PokemonTipoId) o;
        return Objects.equals(pokemonId, that.pokemonId) && Objects.equals(tipoId, that.tipoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pokemonId, tipoId);
    }
}