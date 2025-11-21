package pi.jardim_encantado.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pi.jardim_encantado.model.Usuario;
import pi.jardim_encantado.repository.UsuarioRepository;
import java.util.Optional;

@Component // Diz ao Spring para rodar isto ao iniciar
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Tenta achar o admin pelo email
        Optional<Usuario> adminExistente = usuarioRepository.findByEmail("admin@jardim.com");

        // 2. Se NÃO achar, cria ele agora
        if (adminExistente.isEmpty()) {
            System.out.println("--- CRIANDO USUÁRIO ADMIN AUTOMATICAMENTE ---");
            
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@jardim.com");
            admin.setSenha("1234"); // Senha do admin
            admin.setTelefone("000000000");
            admin.setAdmin(true); // <--- O MAIS IMPORTANTE: Define como ADMIN

            usuarioRepository.save(admin);
            
            System.out.println("--- ADMIN CRIADO COM SUCESSO ---");
        } else {
            System.out.println("--- USUÁRIO ADMIN JÁ EXISTE (NADA A FAZER) ---");
        }
    }
}