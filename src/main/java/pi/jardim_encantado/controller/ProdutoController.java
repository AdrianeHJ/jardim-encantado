package pi.jardim_encantado.controller;

// Importações (Note as mudanças!)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.jardim_encantado.model.Produto;
// import pi.jardim_encantado.repository.ProdutoRepository; // <-- NÃO PRECISAMOS MAIS DISSO
import pi.jardim_encantado.service.ProdutoService; // <-- IMPORTAMOS O SERVICE
import java.util.List;

// @RestController: Continua sendo um "atendente" de API REST (Garçom).
@RestController
// @RequestMapping: A "praça" (URL base) que este garçom atende.
@RequestMapping("/api/produtos")
public class ProdutoController {

    // --- REMOVIDO ---
    // @Autowired
    // private ProdutoRepository produtoRepository; // O Garçom NÃO fala mais com o Estoque.
    // --- FIM DO REMOVIDO ---

    // @Autowired: Injeção de Dependência.
    // O Garçom (Controller) agora está conectado ao Chefe de Cozinha (Service).
    @Autowired
    private ProdutoService produtoService;

    /**
     * Endpoint para CRIAR (Create) um novo produto.
     * URL: POST /api/produtos
     * O frontend enviará um JSON do produto no corpo do pedido.
     */
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        // O Garçom (Controller) não "salva" mais.
        // Ele entrega o pedido (o 'produto') para o Chefe (Service) executar.
        Produto novoProduto = produtoService.criarProduto(produto);
        
        // E então ele entrega a resposta de volta ao cliente (frontend).
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    /**
     * Endpoint para LER (Read) todos os produtos.
     * URL: GET /api/produtos
     */
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        // O Garçom (Controller) pede ao Chefe (Service) a lista de produtos.
        List<Produto> produtos = produtoService.listarTodos();
        
        // E entrega a lista ao cliente (frontend).
        return new ResponseEntity<>(produtos, HttpStatus.OK);
    }

    /**
     * Endpoint para LER (Read) UM produto pelo ID.
     * URL: GET /api/produtos/1 (ou /2, /3, etc.)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoPorId(@PathVariable Integer id) {
        // O Garçom (Controller) pede ao Chefe (Service) para buscar um produto.
        // A lógica de como buscar (o .map/.orElse) agora é feita aqui,
        // mas a busca em si (o findById) é feita pelo Service.
        return produtoService.getProdutoPorId(id)
            .map(produto -> new ResponseEntity<>(produto, HttpStatus.OK)) // Se o Chefe achou
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Se o Chefe não achou
    }
}