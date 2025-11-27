package pi.jardim_encantado.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor

public class Produto {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private int id;
    private String nome;
    @Column(length = 1000) 
    private String descricao;
    private int avaliacao;
    @Column(precision = 10, scale = 2) 
    private BigDecimal preco; 
    private String imagemUrl;
    private String pagina; 
    private String secao;  



}