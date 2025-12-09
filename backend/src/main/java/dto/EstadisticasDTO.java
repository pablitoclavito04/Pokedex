package dto;

/**
 * DTO para Estadisticas
 */
public class EstadisticasDTO {
    private Integer id;
    private Integer ps;
    private Integer ataque;
    private Integer defensa;
    private Integer velocidad;
    private Integer ataqueEspecial;
    private Integer defensaEspecial;
    private Integer total;

    public EstadisticasDTO() {}

    public EstadisticasDTO(Integer id, Integer ps, Integer ataque, Integer defensa, Integer velocidad,
                           Integer ataqueEspecial, Integer defensaEspecial, Integer total) {
        this.id = id;
        this.ps = ps;
        this.ataque = ataque;
        this.defensa = defensa;
        this.velocidad = velocidad;
        this.ataqueEspecial = ataqueEspecial;
        this.defensaEspecial = defensaEspecial;
        this.total = total;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}