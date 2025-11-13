package pi.jardim_encantado.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // 1. Importe esta anotação
import pi.jardim_encantado.model.Usuario;

// @Repository: Esta anotação diz explicitamente ao Spring:
// "Esta interface é um Repositório! Crie um 'bean' (objeto) para ela."
// Isso ajuda o VS Code a encontrar a referência que o @Autowired precisa.
@Repository 
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    /**
     * O Spring Data JPA lê o nome deste método (findByEmail) e,
     * automaticamente, cria a consulta SQL para nós.
     * (Equivalente a: "SELECT * FROM usuario WHERE email = ?")
     */
    Optional<Usuario> findByEmail(String email);
}