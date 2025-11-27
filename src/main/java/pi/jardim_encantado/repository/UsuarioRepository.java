package pi.jardim_encantado.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // 1. Importe esta anotação
import pi.jardim_encantado.model.Usuario;

@Repository 
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);
}