package pi.jardim_encantado.service;

import java.util.Optional; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import pi.jardim_encantado.model.Usuario;
import jakarta.validation.Valid;
import pi.jardim_encantado.repository.UsuarioRepository; 

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository; 
    
    public Usuario registarUsuario(@Valid Usuario novoUsuario) throws Exception {
        if (novoUsuario.getEmail() == null || novoUsuario.getSenha() == null ||
            novoUsuario.getNome() == null || novoUsuario.getTelefone() == null) {
            throw new IllegalArgumentException("Campos obrigatórios (nome, email, senha, telefone) não podem ser nulos.");
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(novoUsuario.getEmail());
        
        if (usuarioExistente.isPresent()) {
            throw new Exception("Email já registrado: " + novoUsuario.getEmail());
        }
        return usuarioRepository.save(novoUsuario);
    }

    public Usuario fazerLogin(String email, String senha) throws Exception {

        Optional<Usuario> usuarioParaLogar = usuarioRepository.findByEmail(email);

        if (usuarioParaLogar.isEmpty()) {
            throw new Exception("Usuário não encontrado com o email: " + email);
        }
        Usuario usuario = usuarioParaLogar.get();

        if (!usuario.getSenha().equals(senha)) {
            throw new Exception("Senha incorreta.");
        }

        return usuario;
    }
}