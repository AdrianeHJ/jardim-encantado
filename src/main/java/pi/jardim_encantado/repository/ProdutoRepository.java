package pi.jardim_encantado.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pi.jardim_encantado.model.Produto;
import org.springframework.stereotype.Repository;

@Repository 
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

}
