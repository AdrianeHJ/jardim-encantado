// Define que esta classe pertence ao novo pacote 'service'
package pi.jardim_encantado.service;

// Importações necessárias para a classe funcionar
import java.util.List;
import java.util.Optional; // Precisamos disso para o método 'findById'
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Importa a anotação @Service
import pi.jardim_encantado.model.Produto;
import pi.jardim_encantado.repository.ProdutoRepository;

// @Service: Esta é a anotação mais importante!
// Ela diz ao Spring: "Esta classe é um 'Chefe de Cozinha'. 
// Gerencie-a e injete-a onde for necessário."
@Service
public class ProdutoService {

    // @Autowired: Injeção de Dependência.
    // O Chefe de Cozinha (@Service) precisa de acesso ao Estoque (@Repository).
    // O Spring vai conectar automaticamente o 'ProdutoRepository' aqui.
    @Autowired
    private ProdutoRepository produtoRepository;

    // --- Métodos de Lógica de Negócio ---

    /**
     * Lógica para LISTAR todos os produtos.
     * O Controller vai chamar este método.
     */
    public List<Produto> listarTodos() {
        // Por enquanto, nossa "lógica" é simples: apenas buscar tudo.
        // Mas, no futuro, poderíamos adicionar regras aqui, como:
        // "Não listar produtos com estoque zero", etc.
        return produtoRepository.findAll();
    }

    /**
     * Lógica para BUSCAR UM produto pelo ID.
     * O Controller vai chamar este método.
     */
    public Optional<Produto> getProdutoPorId(Integer id) {
        // A lógica é apenas repassar a chamada para o repositório.
        return produtoRepository.findById(id);
    }

    /**
     * Lógica para CRIAR um novo produto.
     * O Controller vai chamar este método.
     * @param produto O produto vindo do frontend
     * @return O produto salvo (com ID)
     */
    public Produto criarProduto(Produto produto) {
        // --- AQUI É O LUGAR DA LÓGICA DE NEGÓCIO ---
        // Exemplo de regra de negócio que o Chefe (Service) faz:
        if (produto.getPreco() == null || produto.getPreco().doubleValue() <= 0) {
            // Se o preço for nulo, zero ou negativo, lançamos um erro.
            // O Controller não precisa saber disso, é responsabilidade do Service.
            throw new IllegalArgumentException("O preço do produto é inválido.");
        }
        
        // Se todas as regras passarem, mandamos o Estoque (Repository) salvar.
        return produtoRepository.save(produto);
    }

    // (No futuro, métodos como 'atualizarProduto' ou 'deletarProduto' viriam aqui)
}