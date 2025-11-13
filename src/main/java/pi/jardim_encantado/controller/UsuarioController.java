// Define que esta classe pertence ao pacote 'controller'
package pi.jardim_encantado.controller;

// Importações necessárias
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pi.jardim_encantado.model.Usuario;
import pi.jardim_encantado.service.UsuarioService;

// @RestController: Diz ao Spring que esta classe é um "Garçom" (Controller REST).
// Ela irá receber pedidos HTTP e responder com JSON.
@RestController
// @RequestMapping: Define a URL base para todos os métodos nesta classe.
// Todos os endpoints aqui começarão com "/api/usuarios".
@RequestMapping("/api/usuarios")
public class UsuarioController {

    // @Autowired: Injeção de Dependência.
    // O Garçom (Controller) está a ser conectado ao Chefe de Cozinha (Service).
    @Autowired
    private UsuarioService usuarioService;

    // --- Endpoint de Registo ---

    /**
     * Endpoint para REGISTAR um novo utilizador.
     * Ouve pedidos POST em /api/usuarios/registar
     * @param novoUsuario O objeto Usuario (em JSON) que vem no corpo do pedido
     * @return Uma ResponseEntity que contém o utilizador salvo (se OK) ou uma mensagem de erro (se falhar)
     */
    @PostMapping("/registar")
    public ResponseEntity<?> registarUsuario(@RequestBody Usuario novoUsuario) {
        // O @RequestBody diz ao Spring: "Pega no JSON do corpo do pedido
        // e converte-o num objeto Usuario."
        
        try {
            // O Garçom (Controller) não sabe a lógica.
            // Ele apenas passa o 'novoUsuario' para o Chefe (Service) e espera.
            Usuario usuarioSalvo = usuarioService.registarUsuario(novoUsuario);
            
            // Se o Service terminar sem erros, o Garçom retorna:
            // 1. O utilizador salvo (com o novo ID) no corpo da resposta.
            // 2. O status HTTP 201 (CREATED), que significa "Recurso criado com sucesso".
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
            
        } catch (Exception e) {
            // Se o Service lançar uma exceção (ex: "Email já existe" ou "Campos nulos")
            // O Garçom "apanha" essa exceção.
            // E retorna:
            // 1. A mensagem de erro (ex: "Email já registado") no corpo da resposta.
            // 2. O status HTTP 400 (BAD_REQUEST), para o frontend saber que deu erro.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // --- Endpoint de Login ---

    /**
     * DTO (Data Transfer Object) - Um "mini-objeto" só para o login.
     * Não queremos que o frontend envie um objeto 'Usuario' completo para o login,
     * apenas o email e a senha. Um 'record' é a forma moderna e simples
     * de criar esta "caixinha" de dados em Java.
     */
    public record LoginRequest(String email, String senha) {}

    /**
     * Endpoint para fazer LOGIN.
     * Ouve pedidos POST em /api/usuarios/login
     * @param loginRequest O objeto LoginRequest (em JSON) com email e senha
     * @return Uma ResponseEntity com o Utilizador (se OK) ou uma mensagem de erro (se falhar)
     */
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody LoginRequest loginRequest) {
        try {
            // O Garçom passa o email e a senha para o Chefe (Service) validar.
            Usuario usuarioLogado = usuarioService.fazerLogin(loginRequest.email(), loginRequest.senha());
            
            // Se o Service não lançar erro, o login foi um sucesso.
            // Retorna:
            // 1. O objeto do utilizador logado.
            // 2. O status HTTP 200 (OK).
            return new ResponseEntity<>(usuarioLogado, HttpStatus.OK);

        } catch (Exception e) {
            // Se o Service lançar uma exceção (ex: "Utilizador não encontrado" ou "Senha incorreta")
            // Retorna:
            // 1. A mensagem de erro (ex: "Senha incorreta.").
            // 2. O status HTTP 401 (UNAUTHORIZED), que é o código correto para falha de login.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}