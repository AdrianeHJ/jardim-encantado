package pi.jardim_encantado.service;

import java.util.List;
import java.util.Optional; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import pi.jardim_encantado.model.Produto;
import pi.jardim_encantado.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> getProdutoPorId(Integer id) {
        return produtoRepository.findById(id);
    }

    public Produto criarProduto(Produto produto) {

        if (produto.getPreco() == null || produto.getPreco().doubleValue() <= 0) {
            throw new IllegalArgumentException("O preço do produto é inválido.");
        }
        return produtoRepository.save(produto);
    }
}