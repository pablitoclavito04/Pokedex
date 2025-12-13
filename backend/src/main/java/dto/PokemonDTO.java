package dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO principal para Pokemon
 * ACTUALIZADO con campo imagenUrl
 */
public class PokemonDTO {
    private Integer id;
    private Integer numero;
    private String nombre;
    private BigDecimal altura;
    private BigDecimal peso;
    private String descripcion;
    private String imagenUrl;
    private Integer generacion;
    private List<String> tipos;
    private EstadisticasDTO estadisticas;
    private List<EvolucionDTO> evoluciones;

    public PokemonDTO() {}

    public PokemonDTO(Integer id, Integer numero, String nombre, BigDecimal altura, BigDecimal peso,
                      String descripcion, String imagenUrl, Integer generacion, List<String> tipos,
                      EstadisticasDTO estadisticas, List<EvolucionDTO> evoluciones) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.altura = altura;
        this.peso = peso;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.generacion = generacion;
        this.tipos = tipos;
        this.estadisticas = estadisticas;
        this.evoluciones = evoluciones;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getAltura() {
        return altura;
    }

    public void setAltura(BigDecimal altura) {
        this.altura = altura;
    }

    public BigDecimal getPeso() {
        return peso;
    }

    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Integer getGeneracion() {
        return generacion;
    }

    public void setGeneracion(Integer generacion) {
        this.generacion = generacion;
    }

    public List<String> getTipos() {
        return tipos;
    }

    public void setTipos(List<String> tipos) {
        this.tipos = tipos;
    }

    public EstadisticasDTO getEstadisticas() {
        return estadisticas;
    }

    public void setEstadisticas(EstadisticasDTO estadisticas) {
        this.estadisticas = estadisticas;
    }

    public List<EvolucionDTO> getEvoluciones() {
        return evoluciones;
    }

    public void setEvoluciones(List<EvolucionDTO> evoluciones) {
        this.evoluciones = evoluciones;
    }
}