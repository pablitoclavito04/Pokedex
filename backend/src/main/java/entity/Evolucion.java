package entity;

import jakarta.persistence.*;

/**
 * Entidad Evolucion - Representa la relación de evolución entre dos Pokémon
 */
@Entity
@Table(name = "Evolucion")
public class Evolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEvolucion")
    private Integer id;

    @Column(name = "pokemon_origen_id", nullable = false)
    private Integer pokemonOrigenId;

    @Column(name = "pokemon_destino_id", nullable = false)
    private Integer pokemonDestinoId;

    @Column(name = "nivel_evolucion")
    private Integer nivelEvolucion;

    @Column(name = "metodo", length = 100)
    private String metodo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pokemon_origen_id", insertable = false, updatable = false)
    private Pokemon pokemonOrigen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pokemon_destino_id", insertable = false, updatable = false)
    private Pokemon pokemonDestino;

    // Constructores
    public Evolucion() {}

    public Evolucion(Integer id, Integer pokemonOrigenId, Integer pokemonDestinoId,
                     Integer nivelEvolucion, String metodo) {
        this.id = id;
        this.pokemonOrigenId = pokemonOrigenId;
        this.pokemonDestinoId = pokemonDestinoId;
        this.nivelEvolucion = nivelEvolucion;
        this.metodo = metodo;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPokemonOrigenId() {
        return pokemonOrigenId;
    }

    public void setPokemonOrigenId(Integer pokemonOrigenId) {
        this.pokemonOrigenId = pokemonOrigenId;
    }

    public Integer getPokemonDestinoId() {
        return pokemonDestinoId;
    }

    public void setPokemonDestinoId(Integer pokemonDestinoId) {
        this.pokemonDestinoId = pokemonDestinoId;
    }

    public Integer getNivelEvolucion() {
        return nivelEvolucion;
    }

    public void setNivelEvolucion(Integer nivelEvolucion) {
        this.nivelEvolucion = nivelEvolucion;
    }

    public String getMetodo() {
        return metodo;
    }

    public void setMetodo(String metodo) {
        this.metodo = metodo;
    }

    public Pokemon getPokemonOrigen() {
        return pokemonOrigen;
    }

    public void setPokemonOrigen(Pokemon pokemonOrigen) {
        this.pokemonOrigen = pokemonOrigen;
    }

    public Pokemon getPokemonDestino() {
        return pokemonDestino;
    }

    public void setPokemonDestino(Pokemon pokemonDestino) {
        this.pokemonDestino = pokemonDestino;
    }
}