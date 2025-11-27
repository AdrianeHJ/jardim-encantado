package pi.jardim_encantado.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pi.jardim_encantado.model.Usuario;
import pi.jardim_encantado.service.UsuarioService;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registar")
    public ResponseEntity<?> registarUsuario(@RequestBody Usuario novoUsuario) {
        
        try {
            Usuario usuarioSalvo = usuarioService.registarUsuario(novoUsuario);
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public record LoginRequest(String email, String senha) {}

    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuarioLogado = usuarioService.fazerLogin(loginRequest.email(), loginRequest.senha());
            return new ResponseEntity<>(usuarioLogado, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}