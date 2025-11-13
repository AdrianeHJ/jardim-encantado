// Define que esta classe pertence ao pacote 'model'
package pi.jardim_encantado.model;

// Importações do Jakarta Persistence (JPA) para mapear a classe para o banco
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Importações do Lombok para reduzir o código "boilerplate"
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Entity: Anotação mais importante do JPA.
// Informa ao Spring: "Esta classe é um 'molde' para uma tabela no banco de dados."
// A tabela será chamada 'usuario' (o nome da classe).
@Entity 
// @Data: Anotação do Lombok.
// Cria automaticamente todos os Getters (ex: getNome()), Setters (ex: setNome()),
// e métodos úteis (toString(), equals(), hashCode()) em tempo de compilação.
@Data
// @NoArgsConstructor: Cria um construtor padrão sem argumentos (ex: new Usuario())
// O JPA precisa disto para funcionar.
@NoArgsConstructor
// @AllArgsConstructor: Cria um construtor que aceita todos os campos como argumentos.
// Útil para testes ou para criar objetos de forma rápida.
@AllArgsConstructor 
public class Usuario {

    // @Id: Marca este campo como a Chave Primária (Primary Key) da tabela.
    @Id
    // @GeneratedValue: Diz como o ID deve ser gerado.
    // Usamos 'IDENTITY' para que o H2 (e outros bancos como MySQL)
    // use a sua própria coluna de auto-incremento.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // O ID único do usuário.

    // O Spring/JPA irá criar uma coluna chamada 'nome'
    private String nome;

    // @Column(unique = true): Esta é uma regra importante!
    // Diz ao banco de dados que NÃO deve permitir dois utilizadores
    // com o mesmo email. Garante que cada email seja único.
    @Column(unique = true)
    private String email;

    // O Spring/JPA irá criar uma coluna chamada 'telefone'
    private String telefone;

    // O Spring/JPA irá criar uma coluna chamada 'senha'
    private String senha;
}