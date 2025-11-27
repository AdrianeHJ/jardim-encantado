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

@Entity // mostra que é uma tabela 
@Data // gera getters e setters automaticamente
@NoArgsConstructor // gera construtor vazio
@AllArgsConstructor // gera construtor com todos os atributos

public class Produto {
    @Id  // marca o campo id como chave primaira
    @GeneratedValue(strategy = GenerationType.IDENTITY) // banco gerara esse valor automaticamente
    private int id;

    private String nome;

    @Column(length = 1000) // aumenta p tamanho padrão da coluna descrição 
    private String descricao;

    private int avaliacao;

    @Column(precision = 10, scale = 2) // scale = 2 (garante 2 casas decimais no banco)
    private BigDecimal preco; // Era 'float', agora é 'BigDecimal'
    
    private String imagemUrl;

    private String pagina; // ex: "home", "buques", "conjuntos"
    private String secao;  // ex: "promocoes", "novidades", "mais_vendidos"



}