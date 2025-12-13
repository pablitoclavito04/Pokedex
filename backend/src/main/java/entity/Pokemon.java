package entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidad Pokemon - Representa un Pokémon en la base de datos
 * ACTUALIZADA con campo imagenUrl
 */
@Entity
@Table(name = "Pokemon")
public class Pokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPokemon")
    private Integer id;

    @Column(name = "numero", nullable = false, unique = true)
    private Integer numero;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "altura", nullable = false, precision = 5, scale = 2)
    private BigDecimal altura;

    @Column(name = "peso", nullable = false, precision = 8, scale = 2)
    private BigDecimal peso;

    @Column(name = "descripción", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "imagen_url", length = 255)
    private String imagenUrl;

    @Column(name = "generacion", nullable = false)
    private Integer generacion;

    // Constructores
    public Pokemon() {}

    public Pokemon(Integer id, Integer numero, String nombre, BigDecimal altura, BigDecimal peso,
                   String descripcion, String imagenUrl, Integer generacion) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.altura = altura;
        this.peso = peso;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.generacion = generacion;
    }

    // Getters y Setters
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
}