package entity;

import jakarta.persistence.*;

/**
 * Entidad Tipo - Representa un tipo de Pokémon (Fuego, Agua, Planta, etc.)
 */
@Entity
@Table(name = "Tipo")
public class Tipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTipo")
    private Integer id;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "icono", length = 30)
    private String icono;

    @Column(name = "color", length = 7)
    private String color;

    // Constructores
    public Tipo() {}

    public Tipo(Integer id, String nombre, String icono, String color) {
        this.id = id;
        this.nombre = nombre;
        this.icono = icono;
        this.color = color;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}