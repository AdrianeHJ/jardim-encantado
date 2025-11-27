package pi.jardim_encantado.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pi.jardim_encantado.model.Usuario;
import pi.jardim_encantado.repository.UsuarioRepository;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        Optional<Usuario> adminExistente = usuarioRepository.findByEmail("admin@jardim.com");

        if (adminExistente.isEmpty()) {
            System.out.println("--- CRIANDO USUÁRIO ADMIN AUTOMATICAMENTE ---");
            
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@jardim.com");
            admin.setSenha("1234"); 
            admin.setTelefone("000000000");
            admin.setAdmin(true); 

            usuarioRepository.save(admin);
            
            System.out.println("--- ADMIN CRIADO COM SUCESSO ---");
        } else {
            System.out.println("--- USUÁRIO ADMIN JÁ EXISTE (NADA A FAZER) ---");
        }
    }
}