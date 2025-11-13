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

    public record LoginRequest(String email, String senha) {}

    @PostMapping("/login")
    public ResponseEntity<String> fazerLogin(@RequestBody LoginRequest request) {
        
        if ("admin@jardim.com".equals(request.email()) && "1234".equals(request.senha())) {
            return new ResponseEntity<>("Login de Admin OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Não é admin", HttpStatus.UNAUTHORIZED);
        }
    }
}