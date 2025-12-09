package entity;

import jakarta.persistence.*;

/**
 * Entidad Estadisticas - Representa las estadísticas de combate de un Pokémon
 */
@Entity
@Table(name = "Estadísticas")
public class Estadisticas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEstadísticas")
    private Integer id;

    @Column(name = "idPokemon", nullable = false, unique = true)
    private Integer idPokemon;

    @Column(name = "ps", nullable = false)
    private Integer ps;

    @Column(name = "ataque", nullable = false)
    private Integer ataque;

    @Column(name = "defensa", nullable = false)
    private Integer defensa;

    @Column(name = "velocidad", nullable = false)
    private Integer velocidad;

    @Column(name = "ataque_especial", nullable = false)
    private Integer ataqueEspecial;

    @Column(name = "defensa_especial", nullable = false)
    private Integer defensaEspecial;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPokemon", insertable = false, updatable = false)
    private Pokemon pokemon;

    // Constructores
    public Estadisticas() {}

    public Estadisticas(Integer id, Integer idPokemon, Integer ps, Integer ataque, Integer defensa,
                        Integer velocidad, Integer ataqueEspecial, Integer defensaEspecial) {
        this.id = id;
        this.idPokemon = idPokemon;
        this.ps = ps;
        this.ataque = ataque;
        this.defensa = defensa;
        this.velocidad = velocidad;
        this.ataqueEspecial = ataqueEspecial;
        this.defensaEspecial = defensaEspecial;
    }

    // Método para calcular total
    public Integer calcularTotal() {
        return ps + ataque + defensa + velocidad + ataqueEspecial + defensaEspecial;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdPokemon() {
        return idPokemon;
    }

    public void setIdPokemon(Integer idPokemon) {
        this.idPokemon = idPokemon;
    }

    public Integer getPs() {
        return ps;
    }

    public void setPs(Integer ps) {
        this.ps = ps;
    }

    public Integer getAtaque() {
        return ataque;
    }

    public void setAtaque(Integer ataque) {
        this.ataque = ataque;
    }

    public Integer getDefensa() {
        return defensa;
    }

    public void setDefensa(Integer defensa) {
        this.defensa = defensa;
    }

    public Integer getVelocidad() {
        return velocidad;
    }

    public void setVelocidad(Integer velocidad) {
        this.velocidad = velocidad;
    }

    public Integer getAtaqueEspecial() {
        return ataqueEspecial;
    }

    public void setAtaqueEspecial(Integer ataqueEspecial) {
        this.ataqueEspecial = ataqueEspecial;
    }

    public Integer getDefensaEspecial() {
        return defensaEspecial;
    }

    public void setDefensaEspecial(Integer defensaEspecial) {
        this.defensaEspecial = defensaEspecial;
    }

    public Pokemon getPokemon() {
        return pokemon;
    }

    public void setPokemon(Pokemon pokemon) {
        this.pokemon = pokemon;
    }
}