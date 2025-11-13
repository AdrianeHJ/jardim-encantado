package pi.jardim_encantado.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // Um "record" simples para receber o JSON do login
    // Não precisamos de um arquivo .java separado pa   ra isso.
    public record LoginRequest(String email, String senha) {}

    @PostMapping("/login")
    public ResponseEntity<String> fazerLogin(@RequestBody LoginRequest request) {
        
        // LÓGICA "CHUMBADA" (HARDCODED) - APENAS PARA A DEMO
        if ("admin@jardim.com".equals(request.email()) && "1234".equals(request.senha())) {
            // Se o login for o de admin, retorne OK
            return new ResponseEntity<>("Login de Admin OK", HttpStatus.OK);
        } else {
            // Se não for, retorne "Não autorizado"
            return new ResponseEntity<>("Não é admin", HttpStatus.UNAUTHORIZED);
        }
    }
}