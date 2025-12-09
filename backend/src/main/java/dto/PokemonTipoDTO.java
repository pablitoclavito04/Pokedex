package dto;

/**
 * DTO para PokemonTipo
 */
public class PokemonTipoDTO {
    private Integer pokemonId;
    private String pokemonNombre;
    private Integer tipoId;
    private String tipoNombre;
    private Byte orden;

    public PokemonTipoDTO() {}

    public PokemonTipoDTO(Integer pokemonId, String pokemonNombre, Integer tipoId,
                          String tipoNombre, Byte orden) {
        this.pokemonId = pokemonId;
        this.pokemonNombre = pokemonNombre;
        this.tipoId = tipoId;
        this.tipoNombre = tipoNombre;
        this.orden = orden;
    }

    public Integer getPokemonId() {
        return pokemonId;
    }

    public void setPokemonId(Integer pokemonId) {
        this.pokemonId = pokemonId;
    }

    public String getPokemonNombre() {
        return pokemonNombre;
    }

    public void setPokemonNombre(String pokemonNombre) {
        this.pokemonNombre = pokemonNombre;
    }

    public Integer getTipoId() {
        return tipoId;
    }

    public void setTipoId(Integer tipoId) {
        this.tipoId = tipoId;
    }

    public String getTipoNombre() {
        return tipoNombre;
    }

    public void setTipoNombre(String tipoNombre) {
        this.tipoNombre = tipoNombre;
    }

    public Byte getOrden() {
        return orden;
    }

    public void setOrden(Byte orden) {
        this.orden = orden;
    }
}