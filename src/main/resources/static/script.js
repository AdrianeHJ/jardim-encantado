//Ele garante que todo o código JavaScript dentro dele só execute DEPOIS que o navegador terminou de carregar todo o HTML da página.Isso evita erros de "elemento não encontrado" (null).
document.addEventListener('DOMContentLoaded', function() {
    
    // --- CÓDIGO 1: LÓGICA DO MODAL 
    // Busca o elemento principal do modal (a sobreposição escura)e o armazena na variável 'modal'.
    const modal = document.getElementById('auth-modal');
    
    // Busca o ícone de perfil (usuário) no header e o armazena na variável 'userIcon'. É ele que ABRE o modal.
    const userIcon = document.getElementById('user-icon');
    
    //  Busca TODOS os elementos que têm a classe '.modal-view'. Isso cria uma lista (NodeList) contendo as 3 telas: [div#login-view, div#register-view, div#reset-view]
    const allViews = document.querySelectorAll('.modal-view');
    
    //   Busca TODOS os links que têm o atributo 'data-view'. São os links "Esqueceu a senha?", "Crie sua conta." etc. Eles são responsáveis por TROCAR de tela dentro do modal.
    const viewLinks = document.querySelectorAll('[data-view]');
    
    //  Busca o botão "X" (fechar) de dentro do modal.
    const closeBtn = document.querySelector('.modal-close');

 
     // Define uma FUNÇÃO chamada 'showView'. Esta função é reutilizável e sua tarefa é: Esconder TODAS as telas e mostrar APENAS a tela com o ID que foi passado (ex: 'login-view'). @param {string} viewId - O ID da tela que deve ser mostrada (ex: "login-view").
    function showView(viewId) {
        // Primeiro, verifica se a lista de telas não está vazia.
        if (allViews && allViews.length > 0) {
            //  Faz um loop (forEach) por CADA tela na lista 'allViews'.
            allViews.forEach(view => {
                //  Remove a classe 'active' de TODAS as telas. No seu CSS, a classe 'active' é o que torna a tela visível (display: block).
                view.classList.remove('active');
            });
        }
        
        // Agora, busca a tela específica que queremos mostrar 
        //       (ex: document.getElementById('login-view')).
        const activeView = document.getElementById(viewId);
        
        //  Se (if) a tela foi encontrada...
        if (activeView) {
            // ...adiciona a classe 'active' nela, tornando-a visível.
            activeView.classList.add('active');
        } else {
            // (Segurança) Se um ID errado foi passado, avisa no console (F12).
            console.error('Erro: View do modal com id "' + viewId + '" não foi encontrada.');
        }
    }
    
    /**
     * 1.14. Define uma FUNÇÃO chamada 'openModal'.
     * Sua tarefa é mostrar o modal.
     */
    function openModal() {
        // 1.15. Se (if) o elemento 'modal' (a sobreposição escura) foi encontrado...
        if (modal) {
            // 1.16. ...adiciona a classe 'active' nele, tornando-o visível 
            //       (no CSS, muda de 'display: none' para 'display: flex').
            modal.classList.add('active');
            
            // 1.17. Sempre que o modal abrir, garante que a primeira tela
            //       a ser mostrada é a de 'login-view'.
            showView('login-view');
        }
    }

    /**
     * 1.18. Define uma FUNÇÃO chamada 'closeModal'.
     * Sua tarefa é esconder o modal.
     */
    function closeModal() {
        // 1.19. Se (if) o elemento 'modal' foi encontrado...
        if (modal) {
            // 1.20. ...remove a classe 'active', escondendo-o (display: none).
            modal.classList.remove('active');
        }
    }

    // --- CÓDIGO QUE "OUVE" OS CLIQUES DO MODAL ---

    // 1.21. Se (if) o ícone de perfil ('userIcon') foi encontrado...
    if (userIcon) {
        // 1.22. ...adiciona um "ouvinte" de clique nele.
        //       Quando o usuário clicar no ícone, a função 'openModal' será executada.
        userIcon.addEventListener('click', openModal);
    } 

    // 1.23. Se (if) o botão de fechar ('closeBtn') foi encontrado...
    if (closeBtn) {
        // 1.24. ...adiciona um "ouvinte" de clique nele.
        //       Quando o usuário clicar no "X", a função 'closeModal' será executada.
        closeBtn.addEventListener('click', closeModal);
    } 

    // 1.25. Se (if) o 'modal' (a sobreposição escura) foi encontrado...
    if (modal) {
        // 1.26. ...adiciona um "ouvinte" de clique nele.
        //       (Isto serve para fechar o modal se o usuário clicar FORA da caixa branca)
        modal.addEventListener('click', function(event) {
            // 1.27. 'event.target' é exatamente ONDE o usuário clicou.
            //       'modal' é a sobreposição escura (o "pai").
            //       Se o usuário clicou exatamente na sobreposição (e não na caixa branca)...
            if (event.target === modal) { 
                // 1.28. ...executa a função 'closeModal'.
                closeModal();
            }
        });
    }

    // 1.29. Se (if) a lista de links de troca de tela ('viewLinks') foi encontrada...
    if (viewLinks && viewLinks.length > 0) {
        // 1.30. ...faz um loop por CADA link (ex: "Crie sua conta.").
        viewLinks.forEach(link => {
            // 1.31. Adiciona um "ouvinte" de clique em cada um desses links.
            link.addEventListener('click', function(event) {
                // 1.32. Previne o link de tentar navegar (comportamento padrão do <a>).
                event.preventDefault();
                
                // 1.33. Pega o valor do atributo 'data-view' do link clicado.
                //       (ex: <a data-view="register-view">...</a> -> Pega "register-view")
                const viewId = link.getAttribute('data-view');
                
                // 1.34. Se (if) o atributo existir...
                if (viewId) {
                    // 1.35. ...chama a função 'showView' para mostrar a tela correta.
                    showView(viewId);
                }
            });
        });
    }
    // --- NOVO CÓDIGO: Lógica do Botão Sair do Admin ---
    // 1. Tenta encontrar o ícone de logout do admin
    const adminLogoutIcon = document.getElementById('admin-logout-icon');

    // 2. Se o ícone existir (ou seja, se estamos na página admin.html)
    if (adminLogoutIcon) {
        // 3. Adiciona um ouvinte de clique
        adminLogoutIcon.addEventListener('click', function() {
            // 4. Pergunta ao usuário se ele realmente quer sair
            if (confirm("Deseja sair do painel administrativo e voltar para a página inicial?")) {
                // 5. Se sim, redireciona para a página inicial
                window.location.href = '/index.html'; 
            }
        });
    }
    // --- FIM DO NOVO CÓDIGO DO LOGOUT DO ADMIN ---
    // --- FIM DO CÓDIGO DO MODAL ---


    // --- CÓDIGO 2: LÓGICA DO ADMIN.HTML (Que fizemos antes, com validações) ---
    // (Esta parte cuida do formulário de cadastro de produtos)
    
    // 2.1. Tenta encontrar o formulário de cadastro na página atual
    const formCadastro = document.getElementById('form-cadastro-produto');

    // 2.2. Se (if) ele encontrou o formulário (ou seja, se estamos na admin.html)...
    if (formCadastro) {
        // ...então, adiciona um "ouvinte" para o evento 'submit' (clique no botão Salvar)
        formCadastro.addEventListener('submit', function(evento) {
            // 2.3. Previne o comportamento padrão do HTML, que é recarregar a página
            evento.preventDefault(); 
            
            // 2.4. Pega o elemento (<div>) que usaremos para mostrar mensagens
            const mensagemFeedback = document.getElementById('feedback-mensagem');
            
            // 2.5. Cria uma lista vazia para armazenar mensagens de erro
            let erros = []; 

            // 2.6. Pega os valores de TODOS os campos do formulário
            const nome = document.getElementById('produto-nome').value;
            const descricao = document.getElementById('produto-descricao').value;
            const imagemUrl = document.getElementById('produto-imagemUrl').value;
            
            // 2.7. Lógica do Preço: Pega como texto (ex: "99,90")
            const precoString = document.getElementById('produto-preco').value;
            // 2.8. Substitui a vírgula por ponto (ex: "99.90")
            const precoFormatado = precoString.replace(",", "."); 
            // 2.9. Converte o texto em um número (ex: 99.90)
            const preco = parseFloat(precoFormatado); 
            
            // 2.10. Converte a avaliação em um número inteiro
            const avaliacao = parseInt(document.getElementById('produto-avaliacao').value);

            // 2.11. --- BLOCO DE VALIDAÇÃO ---
            // '.trim()' remove espaços em branco do início e do fim.
            // Se o resultado for uma string vazia (''), é um erro.
            if (nome.trim() === '') { erros.push('O "Nome" não pode ser vazio.'); }
            if (descricao.trim() === '') { erros.push('A "Descrição" não pode ser vazia.'); }
            if (imagemUrl.trim() === '') { erros.push('A "URL da Imagem" não pode ser vazia.'); }
            
            // 'isNaN' (Is Not a Number) checa se a conversão para número falhou (ex: "abc").
            // 'preco <= 0' checa se o número é negativo ou zero.
            if (isNaN(preco) || preco <= 0) { erros.push('O "Preço" deve ser um número válido (ex: 99,90).'); }
            
            // Checa se a avaliação é um número E se está entre 1 e 5.
            if (isNaN(avaliacao) || avaliacao < 1 || avaliacao > 5) { erros.push('A "Avaliação" deve ser de 1 a 5.'); }
            
            // '/^[0-9]+$/' é um Regex que checa se o texto contém APENAS números.
            if (/^[0-9]+$/.test(nome.trim())) { erros.push('O "Nome" não pode ser só números.'); }

            // 2.12. Se (if) a nossa lista 'erros' tiver 1 ou mais itens...
            if (erros.length > 0) {
                // ...mostra os erros para o usuário.
                mensagemFeedback.style.color = '#E74C3C'; // Vermelho
                // 'join("<br>")' transforma a lista de erros em um texto HTML com quebras de linha.
                mensagemFeedback.innerHTML = erros.join('<br>'); 
                return; // PARA a execução. O fetch (envio) não acontece.
            }
            
            // 2.13. Se não houve erros, mostra "Salvando..."
            mensagemFeedback.textContent = 'Salvando...';
            mensagemFeedback.style.color = '#FFF'; // Cor padrão

            // 2.14. Monta o objeto 'produto' que será enviado para a API
            //      (Note que 'preco' já é o número convertido)
            const produto = {
                nome: nome.trim(), 
                descricao: descricao.trim(),
                preco: preco,
                avaliacao: avaliacao,
                imagemUrl: imagemUrl.trim()
            };

            // 2.15. Envia os dados para a API (O 'fetch' faz a chamada POST)
            //SQL -> Objeto JavaScript -> JSON -> Objeto Java -> SQL
            fetch('/api/produtos', { // A URL do nosso ProdutoController
                method: 'POST', // O tipo de requisição (Criar)
                headers: { 'Content-Type': 'application/json' }, // Avisa que o corpo é JSON
                body: JSON.stringify(produto) // Converte o objeto JavaScript em texto JSON
            })
            .then(response => { // 2.16. Quando a API responder...
                if (!response.ok) { // Se a resposta for um erro (ex: 500)...
                    throw new Error('Erro ao salvar'); // ...pula para o '.catch()'.
                }
                return response.json(); // ...converte a resposta (Produto salvo) em objeto JS.
            })
            .then(produtoSalvo => { // 2.17. Se tudo deu certo...
                // Mostra a mensagem de sucesso
                mensagemFeedback.textContent = `Produto "${produtoSalvo.nome}" salvo com ID: ${produtoSalvo.id}!`;
                mensagemFeedback.style.color = 'var(--cor-verde-logo)';
                formCadastro.reset(); // Limpa os campos do formulário
            })
            .catch(error => { // 2.18. Se o 'fetch' ou o '.then' falharem...
                // Mostra a mensagem de erro
                mensagemFeedback.textContent = 'Falha ao salvar. Verifique o console (F12).';
                mensagemFeedback.style.color = '#E74C3C';
            });
        });
    }
    // --- FIM DO CÓDIGO DO ADMIN ---


    // --- CÓDIGO 3: LÓGICA DA PÁGINA INICIAL (Carregar Produtos) ---
    
    // 3.1. Tenta encontrar a "prateleira" de produtos na página atual.
    const gridProdutos = document.querySelector('.product-section .product-grid');

    // 3.2. Se (if) ele encontrou essa "prateleira" (ou seja, se estamos na index.html, buques.html, etc.)...
    if (gridProdutos) {
        // 3.3. ...então, chama a função 'carregarProdutos' (definida lá embaixo)
        carregarProdutos(gridProdutos); 
    }
    // --- FIM DO CÓDIGO DA PÁGINA INICIAL ---

}); // <-- FIM DO 'DOMContentLoaded'


/**
 * ===================================================================================
 * FUNÇÕES AUXILIARES (Definidas fora do 'DOMContentLoaded')
 * ===================================================================================
 */


/**
 * (FUNÇÃO NOVA)
 * Tarefa: Conectar-se à API (GET /api/produtos), buscar a lista de produtos
 * e desenhar os cards na tela.
 * * 'async' na frente da função nos permite usar a palavra 'await' lá dentro.
 * 'await' pausa a função até que a operação (como o fetch) termine.
 */
async function carregarProdutos(gridElement) {
    //SQL -> Objeto Java -> JSON -> Objeto JavaScript
    // 'try...catch' é um bloco de segurança.
    // Se qualquer coisa dentro do 'try' falhar (ex: API offline),
    // o código pula direto para o 'catch' (bloco de erro) sem quebrar o site.
    try {
        
        // 1. CHAMA A API:
        // 'await fetch(...)' -> Pausa o script e faz a chamada de rede para a nossa API (GET)
        const response = await fetch('/api/produtos'); //

        // 2. VERIFICA O SUCESSO:
        if (!response.ok) {
            throw new Error('Não foi possível buscar os produtos. Status: ' + response.status);
        }
        
        // 3. CONVERTE A RESPOSTA:
        // 'await response.json()' -> Converte a resposta (texto JSON) em uma lista JavaScript.
        const produtos = await response.json();

        // 4. LIMPA O GRID:
        // Remove todo o HTML estático (os exemplos) de dentro da "prateleira".
        gridElement.innerHTML = '';

        // 5. VERIFICA SE O BANCO ESTÁ VAZIO:
        if (produtos.length === 0) {
            gridElement.innerHTML = '<p style="color: white; grid-column: 1 / -1;">Nenhum produto cadastrado ainda. Cadastre produtos na página de <a href="/admin.html" style="color: var(--cor-verde-logo); text-decoration: underline;">Admin</a>.</p>';
            return; // Encerra a função aqui.
        }

        // 6. CRIA OS CARDS (Loop):
        produtos.forEach(produto => {
            
            // 7. MONTA O HTML (Template Literal):
            // Usamos ${...} para injetar os dados do produto (do banco) no HTML.
            // Usamos as classes CSS que já criamos no style.css.
            const cardHTML = `
                <div class="product-card">
                    <a href="/produto.html?id=${produto.id}"> 
                        <img src="${produto.imagemUrl}" alt="${produto.nome}">
                    </a>
                    <div class="product-card-info">
                        <h3>${produto.nome}</h3>
                        <div class="product-card-rating">
                            ${gerarEstrelas(produto.avaliacao)}
                        </div>
                        <div class="product-card-price">${formatarPreco(produto.preco)}</div>
                    </div>
                </div>
            `;
            
            // 8. ADICIONA O CARD NA TELA:
            gridElement.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        // 9. BLOCO DE ERRO:
        console.error("Erro ao carregar produtos:", error); // Mostra o erro no console (F12)
        gridElement.innerHTML = '<p style="color: red; grid-column: 1 / -1;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

/**
 * (FUNÇÃO NOVA - Auxiliar)
 * Tarefa: Converter um número (ex: 4) em estrelas (ex: ★★★★☆)
 */
function gerarEstrelas(avaliacao) {
    let estrelasHTML = ''; // Começa com um texto vazio
    const nota = parseInt(avaliacao) || 0; // Garante que temos um número (ou 0)
    
    // Loop de 1 a 5
    for (let i = 1; i <= 5; i++) {
        if (i <= nota) {
            estrelasHTML += '<span>★</span>'; // Estrela preenchida
        } else {
            estrelasHTML += '<span>☆</span>'; // Estrela vazia
        }
    }
    return estrelasHTML; // Retorna o texto HTML
}

/**
 * (FUNÇÃO NOVA - Auxiliar)
 * Tarefa: Formatar um número (ex: 129.9) para R$ 129,90
 */
function formatarPreco(preco) {
    const numeroPreco = Number(preco); 
    
    // 'toLocaleString' é uma função nativa do JavaScript para formatação.
    // 'pt-BR' -> Formato Português-Brasil (usa R$ e vírgula)
    // 'style: 'currency'' -> Formato de moeda (adiciona o "R$")
    // 'currency: 'BRL'' -> Especifica que a moeda é Real Brasileiro
    return numeroPreco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}