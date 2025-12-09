package dto;

/**
 * DTO para Tipo
 */
public class TipoDTO {
    private Integer id;
    private String nombre;
    private String icono;
    private String color;

    public TipoDTO() {}

    public TipoDTO(Integer id, String nombre, String icono, String color) {
        this.id = id;
        this.nombre = nombre;
        this.icono = icono;
        this.color = color;
    }

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