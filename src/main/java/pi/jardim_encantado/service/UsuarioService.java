// Define que esta classe pertence ao pacote 'service'
package pi.jardim_encantado.service;

// Importações necessárias
import java.util.Optional; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import pi.jardim_encantado.model.Usuario;
import jakarta.validation.Valid;

// IMPORT QUE ESTAVA FALTANDO (PROVAVELMENTE):
import pi.jardim_encantado.repository.UsuarioRepository; 

@Service
public class UsuarioService {

    // @Autowired: Injeção de Dependência.
    // O Chefe (@Service) precisa de acesso ao Estoque (@Repository).
    @Autowired
    private UsuarioRepository usuarioRepository; // <-- O erro vai sumir daqui

    /**
     * Lógica de Negócio para REGISTRAR um novo usuário.
     * @param novoUsuario O objeto Usuario vindo do Controller
     * @return O Usuario que foi salvo no banco
     * @throws Exception Se o email já estiver em uso
     */
    public Usuario registarUsuario(@Valid Usuario novoUsuario) throws Exception {
        // --- Regra de Negócio 1: Validar os dados ---
        if (novoUsuario.getEmail() == null || novoUsuario.getSenha() == null ||
            novoUsuario.getNome() == null || novoUsuario.getTelefone() == null) {
            // Garante que os campos principais não são nulos
            throw new IllegalArgumentException("Campos obrigatórios (nome, email, senha, telefone) não podem ser nulos.");
        }

        // --- Regra de Negócio 2: Verificar se o email já existe ---
        // Usamos o método mágico 'findByEmail' que criamos no Repository
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(novoUsuario.getEmail());
        
        // .isPresent() verifica se o Optional contém alguma coisa
        if (usuarioExistente.isPresent()) {
            // Se sim, não podemos registrar. Lançamos um erro.
            throw new Exception("Email já registrado: " + novoUsuario.getEmail());
        }

        // --- Sucesso! ---
        // Se todas as regras passaram, mandamos o Estoque (Repository) salvar.
        return usuarioRepository.save(novoUsuario);
    }

    /**
     * Lógica de Negócio para fazer LOGIN.
     * @param email O email fornecido pelo usuário
     * @param senha A senha fornecida pelo usuário
     * @return O objeto Usuario se o login for bem-sucedido
     * @throws Exception Se o login falhar (email não encontrado ou senha errada)
     */
    public Usuario fazerLogin(String email, String senha) throws Exception {
        // --- Regra de Negócio 1: Encontrar o usuário pelo email ---
        // Usamos o 'findByEmail' novamente.
        Optional<Usuario> usuarioParaLogar = usuarioRepository.findByEmail(email);

        // .isEmpty() verifica se o Optional está vazio
        if (usuarioParaLogar.isEmpty()) {
            // Se o email não existe no banco, lançamos um erro.
            throw new Exception("Usuário não encontrado com o email: " + email);
        }

        // Se o usuário foi encontrado, nós o "desembrulhamos" do Optional
        Usuario usuario = usuarioParaLogar.get();

        // --- Regra de Negócio 2: Verificar a Senha ---
        if (!usuario.getSenha().equals(senha)) {
            // Se as senhas NÃO forem iguais, lançamos um erro.
            throw new Exception("Senha incorreta.");
        }

        // --- Sucesso! ---
        // Se o email existia E a senha estava correta, retornamos o objeto Usuario.
        return usuario;
    }
}