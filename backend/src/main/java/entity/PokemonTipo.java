package entity;

import jakarta.persistence.*;

/**
 * Entidad PokemonTipo - Relación N:M entre Pokemon y Tipo
 */
@Entity
@Table(name = "Pokemon_tipo")
@IdClass(PokemonTipoId.class)
public class PokemonTipo {

    @Id
    @Column(name = "pokemon_id")
    private Integer pokemonId;

    @Id
    @Column(name = "tipo_id")
    private Integer tipoId;

    @Column(name = "orden", nullable = false)
    private Byte orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pokemon_id", insertable = false, updatable = false)
    private Pokemon pokemon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_id", insertable = false, updatable = false)
    private Tipo tipo;

    // Constructores
    public PokemonTipo() {}

    public PokemonTipo(Integer pokemonId, Integer tipoId, Byte orden) {
        this.pokemonId = pokemonId;
        this.tipoId = tipoId;
        this.orden = orden;
    }

    // Getters y Setters
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

    public Byte getOrden() {
        return orden;
    }

    public void setOrden(Byte orden) {
        this.orden = orden;
    }

    public Pokemon getPokemon() {
        return pokemon;
    }

    public void setPokemon(Pokemon pokemon) {
        this.pokemon = pokemon;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }
}