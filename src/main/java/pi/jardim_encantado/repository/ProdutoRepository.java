package pi.jardim_encantado.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pi.jardim_encantado.model.Produto;
import org.springframework.stereotype.Repository;

@Repository // avisa ao spring que isso é um repositorio

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // 2. Não precisa escrever mais NADA aqui.
    
    // O JpaRepository<Produto, Integer> significa:
    // "Crie um repositório para a entidade 'Produto', 
    // onde o ID é do tipo 'Integer'."
    
    // Você magicamente acabou de ganhar métodos como:
    // .save(produto)       -> (Cria ou Atualiza um produto)
    // .findAll()           -> (Lê todos os produtos)
    // .findById(id)        -> (Busca um produto pelo ID)
    // .deleteById(id)      -> (Deleta um produto)
    
}
