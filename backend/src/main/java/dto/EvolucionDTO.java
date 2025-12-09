package dto;

/**
 * DTO para Evolucion
 */
public class EvolucionDTO {
    private Integer id;
    private String pokemonOrigen;
    private String pokemonDestino;
    private Integer nivelEvolucion;
    private String metodo;

    public EvolucionDTO() {}

    public EvolucionDTO(Integer id, String pokemonOrigen, String pokemonDestino,
                        Integer nivelEvolucion, String metodo) {
        this.id = id;
        this.pokemonOrigen = pokemonOrigen;
        this.pokemonDestino = pokemonDestino;
        this.nivelEvolucion = nivelEvolucion;
        this.metodo = metodo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPokemonOrigen() {
        return pokemonOrigen;
    }

    public void setPokemonOrigen(String pokemonOrigen) {
        this.pokemonOrigen = pokemonOrigen;
    }

    public String getPokemonDestino() {
        return pokemonDestino;
    }

    public void setPokemonDestino(String pokemonDestino) {
        this.pokemonDestino = pokemonDestino;
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
}