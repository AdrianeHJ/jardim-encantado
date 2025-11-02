package pi.jardim_encantado.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pi.jardim_encantado.model.Produto;
import pi.jardim_encantado.repository.ProdutoRepository;

import java.util.List;

@RestController // Diz ao Spring que esta classe é um "atendente" de API, ou seja, pode receber metodos http get,poste responde com json
@RequestMapping("/api/produtos") // Todos os pedidos para esta classe começarão com "/api/produtos"
public class ProdutoController {

    //"Injeção de Dependência". Ele diz: "Spring, por favor, encontre o 'operário' (ProdutoRepository) que eu criei e conecte-o (injete-o) nesta variável".
    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * Endpoint para CRIAR (Create) um novo produto.
     * URL: POST /api/produtos
     * O frontend enviará um JSON do produto no corpo do pedido.
     */
    @PostMapping //Diz ao Spring que este método deve "ouvir" pedidos do tipo POST.
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) { 
        // public ResponseEntity<Produto>: Informa que a resposta conterá um objeto 'Produto' (o produto que foi salvo).

        // @RequestBody Produto produto: diz: "Pegue o JSON que veio no corpo (Body) do pedido e tente convertê-lo automaticamente em um objeto 'Produto'".

        Produto novoProduto = produtoRepository.save(produto);
        // Dá a ordem para o "operário" (produtoRepository) pegar o objeto 'produto' (que veio do frontend) e salvá-lo no banco de dados.


        
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
        // Retorna o produto salvo (com o novo ID) e um status "201 Created"
    }

    /**
     * Endpoint para LER (Read) todos os produtos.
     * URL: GET /api/produtos
     */

    @GetMapping // Diz ao Spring que este método deve "ouvir" pedidos do tipo GET. Ele também ouve o caminho base: GET para "/api/produtos".

    public ResponseEntity<List<Produto>> listarProdutos() {
        // public ResponseEntity<List<Produto>>: Informa que a resposta será uma lista (List) de objetos 'Produto'.

        
        List<Produto> produtos = produtoRepository.findAll();
        // Dá a ordem para o "operário" (produtoRepository) ir ao banco e buscar TODOS (findAll) os produtos cadastrados.
        
        return new ResponseEntity<>(produtos, HttpStatus.OK);
        // Cria a resposta HTTP.
        //     Argumento 1: 'produtos' -> A lista completa de produtos é colocada no corpo da resposta.
        //     Argumento 2: 'HttpStatus.OK' -> Define o status como "200 OK",
        //     que significa "Aqui está o que você pediu".
    }

}