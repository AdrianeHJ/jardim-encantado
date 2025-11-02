package pi.jardim_encantado.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // mostra que é uma tabela 
@Data // crua getter,setter, toString etc
@NoArgsConstructor // cria contrutor vazio
@AllArgsConstructor // cria construtor com todos os campos

public class Produto {
    @Id  // marca o campo id como chave primaira
    @GeneratedValue(strategy = GenerationType.AUTO) // banco gerara esse valor automaticamente
    private int id;

    private String nome;

    @Column(length = 1000) // aumenta p tamanho padrão da coluna descrição 
    private String descrição;

    private int avaliacao;
    private float preco;

    private String imagemUrl;
}
