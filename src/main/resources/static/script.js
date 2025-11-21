//Ele garante que todo o código JavaScript dentro dele só execute DEPOIS que o navegador terminou de carregar todo o HTML da página.Isso evita erros de "elemento não encontrado" (null).
document.addEventListener('DOMContentLoaded', function () {

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
        modal.addEventListener('click', function (event) {
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
            link.addEventListener('click', function (event) {
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
        adminLogoutIcon.addEventListener('click', function () {
            // 4. Pergunta ao usuário se ele realmente quer sair
            if (confirm("Deseja sair do painel administrativo e voltar para a página inicial?")) {
                // 5. Se sim, limpa o login e redireciona
                localStorage.removeItem('adminLogado'); // <-- ADICIONE ESTA LINHA
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
        formCadastro.addEventListener('submit', function (evento) {
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

    // 3.1. Tenta encontrar TODAS as "prateleiras" de produtos na página atual.
    const todasAsGrids = document.querySelectorAll('.product-section .product-grid');

    // 3.2. Se (if) ele encontrou uma ou mais "prateleiras"...
    if (todasAsGrids.length > 0) {

        // 3.3. ...faz um loop e chama o 'carregarProdutos' para CADA UMA DELAS.
        todasAsGrids.forEach((grid, index) => {
            // index será 0 para a 1ª grade, 1 para a 2ª, 2 para a 3ª, etc.
            carregarProdutos(grid, index);
        });
    }
    // --- FIM DO CÓDIGO DA PÁGINA INICIAL ---
    // (Coloque isso dentro do 'DOMContentLoaded', junto com os outros códigos)

    // --- CÓDIGO 4: LÓGICA DE LOGIN (ADMIN E USUÁRIO) ---

    // 4.1. Tenta encontrar o formulário de login
    const loginForm = document.querySelector('#login-view form');

    if (loginForm) {
        // 4.2. Adiciona um "ouvinte" ao envio do formulário
        // (Usamos 'async' para poder usar 'await')
        loginForm.addEventListener('submit', async function (event) {

            // 4.3. Previne o recarregamento da página
            event.preventDefault();

            // 4.4. Pega os valores dos campos
            const emailInput = loginForm.querySelector('input[type="email"]');
            const senhaInput = loginForm.querySelector('input[type="password"]');

            const dadosLogin = {
                email: emailInput.value,
                senha: senhaInput.value
            };

            try {
                // --- TENTATIVA 1: LOGIN DE ADMIN (Hardcoded) ---
                const adminResponse = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosLogin)
                });

                if (adminResponse.ok) {
                    // 4.5. SUCESSO COMO ADMIN! Salva o estado e redireciona
                    localStorage.setItem('adminLogado', 'true'); // <-- ADICIONE ESTA LINHA
                    alert('Login de admin bem-sucedido!');
                    window.location.href = '/admin.html';
                    return; // Encerra a função aqui
                }

                // 4.6. Se o adminResponse NÃO foi 'ok' (ex: status 401),
                // o código continua e tenta o login de usuário.

                // --- TENTATIVA 2: LOGIN DE USUÁRIO (Banco de Dados) ---
                const userResponse = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosLogin)
                });

                if (userResponse.ok) {
                    // 4.7. SUCESSO COMO USUÁRIO!
                    const usuarioLogado = await userResponse.json();
                    alert('Login bem-sucedido! Bem-vindo(a), ' + usuarioLogado.nome + '!');
                    // Salva o nome do usuário no "cache" do navegador
                    localStorage.setItem('usuarioLogado', usuarioLogado.nome);
                    // Recarrega a página para mostrar o novo header
                    window.location.reload();
                    // Fecha o modal de login
                    // A função closeModal já existe no "CÓDIGO 1"
                    closeModal();
                    // (Aqui poderíamos salvar o usuário no localStorage, etc.,
                    // mas por enquanto, só fechamos o modal)

                } else {
                    // 4.8. FALHA NAS DUAS TENTATIVAS!
                    // Pega a mensagem de erro (ex: "Senha incorreta.")
                    const mensagemErro = await userResponse.text();
                    alert('Falha no login: ' + mensagemErro);
                }

            } catch (error) {
                // 4.9. Erro de rede (ex: backend desligado)
                console.error('Erro ao tentar logar:', error);
                alert('Erro de conexão com o servidor.');
            }
        });
    }
    // --- FIM DO CÓDIGO 4 (ATUALIZADO) ---

    // --- CÓDIGO 5: LÓGICA DA PÁGINA DE PRODUTO ESPECÍFICO ---

    // 5.1. Tenta encontrar um elemento que só existe na página de produto
    const layoutProduto = document.querySelector('.product-detail-layout');

    // 5.2. Se ele achou (ou seja, se estamos na produto.html)...
    if (layoutProduto) {
        // 5.3. ...chama a função para carregar o produto
        carregarProdutoEspecifico(layoutProduto);
    }


    async function carregarProdutoEspecifico(layout) {
        try {
            // 5.4. Pega o ID da URL (ex: ?id=3)
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            if (!id) {
                layout.innerHTML = "<h1>Produto não encontrado (ID não fornecido).</h1>";
                return;
            }

            // 5.5. Busca o produto na API (ex: /api/produtos/3)
            const response = await fetch(`/api/produtos/${id}`);

            if (!response.ok) {
                throw new Error('Produto não encontrado ou erro no servidor.');
            }

            const produto = await response.json();

            // 5.6. Preenche o HTML estático com os dados do produto

            // Pega os elementos do HTML estático
            const titulo = layout.querySelector('h1');
            const descricao = layout.querySelector('p.description');
            const preco = layout.querySelector('.price');
            const imagemPrincipal = layout.querySelector('.main-image img');

            // (Função 'formatarPreco' já existe no script)

            // Preenche os elementos
            document.title = produto.nome + " - Jardim Encantado"; // Atualiza o título da aba
            titulo.textContent = produto.nome;
            descricao.textContent = produto.descricao;
            preco.textContent = formatarPreco(produto.preco);
            imagemPrincipal.src = produto.imagemUrl;
            imagemPrincipal.alt = produto.nome;

            // (As miniaturas (thumbnails) ainda ficarão estáticas por enquanto)
            // --- NOVO CÓDIGO DO CARRINHO ---

            // 5.1. Encontra o botão "Adicionar ao carrinho"
            const btnAdicionar = layout.querySelector('.btn-primary');

            // 5.2. Remove o link que o botão tinha no HTML
            const linkBotao = btnAdicionar.parentElement;
            if (linkBotao.tagName === 'A') {
                linkBotao.replaceWith(btnAdicionar); // Substitui o <a> pelo <button>
            }

            // 5.3. Adiciona um "ouvinte" de clique no botão
            btnAdicionar.addEventListener('click', function () {

                // 5.4. Lê o carrinho salvo no localStorage (ou cria um array vazio)
                // JSON.parse transforma o texto do cache de volta em um objeto/array
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

                // 5.5. Verifica se o produto JÁ ESTÁ no carrinho
                const itemExistente = carrinho.find(item => item.id === produto.id);

                if (itemExistente) {
                    // Se já existe, apenas aumenta a quantidade
                    itemExistente.quantidade++;
                } else {
                    // Se não existe, adiciona o produto novo ao carrinho
                    carrinho.push({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagemUrl: produto.imagemUrl,
                        quantidade: 1 // Começa com 1
                    });
                }

                // 5.6. Salva o carrinho atualizado de volta no localStorage
                // JSON.stringify transforma nosso array em texto para salvar
                localStorage.setItem('carrinho', JSON.stringify(carrinho));

                // 5.7. Avisa o usuário e o redireciona
                alert('Produto adicionado ao carrinho!');
                window.location.href = '/comprar.html'; // Manda ele para a página do carrinho
            });
            // --- FIM DO NOVO CÓDIGO DO CARRINHO ---
        } catch (error) {
            console.error("Erro ao carregar produto:", error);
            layout.innerHTML = `<h1 style='color: red;'>Erro ao carregar produto.</h1><p>${error.message}</p>`;
        }
    }
    // --- FIM DO CÓDIGO 5 ---
    // --- CÓDIGO 6: LÓGICA DE REGISTRO DE USUÁRIO ---

    // 6.1. Encontra o formulário de registro (o da "view" de registro)
    // (Este seletor busca o <form> dentro da <div> com id="register-view")
    const registerForm = document.querySelector('#register-view form');

    // 6.2. Se o formulário de registro existir nesta página...
    if (registerForm) {

        // 6.3. Adiciona um "ouvinte" ao evento de 'submit' (clique no botão "Criar conta")
        // Usamos 'async' aqui para poder usar 'await' no fetch
        registerForm.addEventListener('submit', async function (event) {

            // 6.4. Previne o comportamento padrão do HTML (que é recarregar a página)
            event.preventDefault();

            // 6.5. Pega os valores dos campos de dentro do formulário de registro
            // (Usamos 'registerForm.querySelector' para garantir que pegamos os inputs
            // corretos, e não os do formulário de login)
            const email = registerForm.querySelector('input[type="email"]').value;
            const nome = registerForm.querySelector('input[type="text"]').value;
            const telefone = registerForm.querySelector('input[type="tel"]').value;
            const senha = registerForm.querySelector('input[type="password"]').value;

            // 6.6. Monta o objeto 'Usuario' (os nomes dos campos - nome, email, etc.)
            // devem ser IDÊNTICOS aos da sua classe 'Usuario.java' no backend
            const novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha
            };

            // 6.7. Envia os dados para a API de registro que criamos
            try {
                // 'await' pausa o script aqui até o servidor responder
                const response = await fetch('/api/usuarios/registar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoUsuario) // Converte o objeto JS em texto JSON
                });

                if (response.ok) {
                    // 6.8. SUCESSO! O backend retornou status 201 (CREATED)
                    const usuarioSalvo = await response.json(); // Pega o usuário salvo

                    alert('Conta criada com sucesso para ' + usuarioSalvo.nome + '! Faça o login agora.');

                    // Como a conta foi criada, trocamos o modal para a tela de login
                    // A função showView já existe no seu "CÓDIGO 1"
                    showView('login-view');

                } else {
                    // 6.9. ERRO! O backend retornou status 400 (ex: "Email já existe")
                    const mensagemErro = await response.text(); // Pega a mensagem de erro
                    alert('Falha no registro: ' + mensagemErro);
                }
            } catch (error) {
                // 6.10. Erro de rede (ex: backend desligado)
                console.error('Erro ao tentar registrar:', error);
                alert('Erro de conexão com o servidor. Verifique o console (F12).');
            }
        });
    }
    // --- FIM DO CÓDIGO 6 ---
    // --- CÓDIGO 7: VERIFICA LOGIN PERSISTENTE (DIVIDIDO) ---

    // 7.1. Procura no 'cache' do navegador se tem um usuário logado
    const nomeUsuario = localStorage.getItem('usuarioLogado');

    // 7.2. Se encontrou (ou seja, se um usuário comum está logado)...
    if (nomeUsuario) {

        // --- PARTE A: LADO ESQUERDO (Mensagem "Olá") ---

        // 7.3. Encontra o container da ESQUERDA
        const iconeEsquerda = document.querySelector('.header-icone-esquerda');
        // 7.4. Encontra o ícone de LOGIN (que está lá dentro)
        const iconeLogin = document.getElementById('user-icon');

        if (iconeEsquerda && iconeLogin) {
            // 7.5. Esconde o ícone de LOGIN original
            iconeLogin.style.display = 'none';

            // 7.6. Cria o HTML SÓ com a mensagem de "Olá"
            const htmlOla = `
                <div class="user-info" style="color: white; display: flex; align-items: center; height: 35px;">
                    <span>Olá, ${nomeUsuario}</span>
                </div>
            `;
            // 7.7. Insere a mensagem no container da ESQUERDA
            iconeEsquerda.insertAdjacentHTML('beforeend', htmlOla);
        }

        // --- PARTE B: LADO DIREITO (Ícone de Sair) ---

        // 7.8. Encontra o container da DIREITA (onde está o carrinho)
        const iconeDireita = document.querySelector('.header-icone-direita');

        if (iconeDireita) {
            // 7.9. Cria o HTML SÓ com o ícone de "Sair"
            const htmlLogout = `
                <a id="logout-btn" style="cursor: pointer;" title="Sair">
                    <img src="/images/sign_out.png" class="material-symbols-outlined" alt="Sair" style="width: 30px; height: 30px;">
                </a>
            `;
            // 7.10. Insere o ícone NO INÍCIO do container da direita
            // (Isso o coloca ANTES do ícone do carrinho)
            iconeDireita.insertAdjacentHTML('afterbegin', htmlLogout);
        }
    }

    // 7.11. Adiciona o evento de clique no botão "Sair" que acabamos de criar
    // (Este código não muda, ele vai achar o 'logout-btn' onde quer que ele esteja)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('usuarioLogado'); // Limpa o cache
                window.location.reload(); // Recarrega a página
            }
        });
    }
    // --- FIM DO CÓDIGO 7 (ATUALIZADO) ---
    
    // --- CÓDIGO 8: "SEGURANÇA" DA PÁGINA ADMIN ---

    // 8.1. Tenta encontrar o formulário de cadastro de produto
    // (Isso nos diz se estamos na página admin.html)
    const formAdmin = document.getElementById('form-cadastro-produto');

    if (formAdmin) {
        // 8.2. Estamos na página de admin. Agora, verificamos se o usuário TEM permissão.
        const isAdmin = localStorage.getItem('adminLogado');

        if (isAdmin !== 'true') {
            // 8.3. O usuário NÃO ESTÁ logado como admin.
            // Expulsa ele da página.
            alert('Acesso negado. Você precisa fazer login como administrador.');
            window.location.href = '/index.html';
        }
    }
    // --- FIM DO CÓDIGO 8 ---

    // --- CÓDIGO 9: INICIALIZAR CARRINHO (Se estivermos na página comprar.html) ---
    const listaCarrinho = document.querySelector('.cart-list');
    if (listaCarrinho) {
        // Se achou a lista, significa que estamos na página do carrinho.
        // Chama a função global para desenhar os itens.
        atualizarCarrinhoNaTela();
    }
    // --- FIM DO CÓDIGO 9 ---
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
async function carregarProdutos(gridElement, secaoIndex) {
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
            return;
        }

        // --- NOVO CÓDIGO DO "TRUQUE" ---
        const produtosPorSecao = 4; // Quantos produtos por seção? 4.
        const inicio = secaoIndex * produtosPorSecao; // ex: 0 * 4 = 0  ||  1 * 4 = 4
        const fim = inicio + produtosPorSecao;      // ex: 0 + 4 = 4  ||  4 + 4 = 8
        const produtosDaSecao = produtos.slice(inicio, fim); // Pega o "pedaço" da lista
        // --- FIM DO NOVO CÓDIGO ---

        // 6. CRIA OS CARDS (Loop):
        produtosDaSecao.forEach(produto => { // <-- Mude "produtos" para "produtosDaSecao"

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

    /**
 * (FUNÇÃO NOVA)
 * Lê o localStorage e desenha os itens na página comprar.html
 */
    function atualizarCarrinhoNaTela() {
        const container = document.querySelector('.cart-list');
        const elementoTotal = document.querySelector('.summary-row.total span:last-child');
        const elementoSubtotal = document.querySelector('.summary-row span:last-child');

        if (!container) return;

        // 1. Lê o carrinho do cache
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // 2. Limpa os itens estáticos (de exemplo)
        container.innerHTML = '';

        // 3. Se estiver vazio...
        if (carrinho.length === 0) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center;">Seu carrinho está vazio.</div>';
            if (elementoTotal) elementoTotal.textContent = 'R$ 0,00';
            if (elementoSubtotal) elementoSubtotal.textContent = 'R$ 0,00';
            return;
        }

        let total = 0;

        // 4. Desenha cada item
        carrinho.forEach((item, index) => {
            const subtotalItem = item.preco * item.quantidade;
            total += subtotalItem;

            const htmlItem = `
            <div class="cart-item">
                <div class="cart-item-product">
                    <img src="${item.imagemUrl}" alt="${item.nome}">
                    <h3>${item.nome}</h3>
                </div>
                <div class="quantity-selector">
                    <button onclick="alterarQtdCarrinho(${index}, -1)">-</button>
                    <span class="quantity">${item.quantidade}</span>
                    <button onclick="alterarQtdCarrinho(${index}, 1)">+</button>
                </div>
                <div class="item-price">${formatarPreco(subtotalItem)}</div>
                <span class="material-symbols-outlined remove-item" onclick="removerItemCarrinho(${index})" style="cursor: pointer;">
                    <img src="/images/excluir.png" alt="Excluir" style="width: 24px;">
                </span>
            </div>
        `;
            container.insertAdjacentHTML('beforeend', htmlItem);
        });

        // 5. Atualiza o Total na tela
        if (elementoTotal) elementoTotal.textContent = formatarPreco(total);
        // Atualiza o Subtotal também (geralmente é o primeiro summary-row)
        // Vamos assumir que o subtotal é o mesmo valor para simplificar
        const todosValores = document.querySelectorAll('.summary-row span:last-child');
        if (todosValores.length > 0) todosValores[0].textContent = formatarPreco(total);
    }

    /**
     * (FUNÇÃO NOVA)
     * Aumenta ou diminui a quantidade de um item
     */
    function alterarQtdCarrinho(index, mudanca) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho[index]) {
            carrinho[index].quantidade += mudanca;

            // Se a quantidade for para 0, remove o item
            if (carrinho[index].quantidade <= 0) {
                carrinho.splice(index, 1);
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinhoNaTela(); // Redesenha a tela
        }
    }

    /**
     * (FUNÇÃO NOVA)
     * Remove um item do carrinho
     */
    function removerItemCarrinho(index) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.splice(index, 1); // Remove 1 item na posição index
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinhoNaTela(); // Redesenha a tela
    }

    // --- LÓGICA DO CARRINHO (COMPRAR.HTML) ---

/**
 * Lê o localStorage e desenha os itens na página comprar.html
 */
function atualizarCarrinhoNaTela() {
    const container = document.querySelector('.cart-list');
    const elementoTotal = document.querySelector('.summary-row.total span:last-child');
    const elementoSubtotal = document.querySelector('.summary-row span:last-child');
    
    if (!container) return; // Se não estiver na página do carrinho, para aqui.

    // 1. Lê o carrinho do cache
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // 2. Limpa os itens estáticos (aqueles de exemplo)
    container.innerHTML = '';

    // 3. Se estiver vazio...
    if (carrinho.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; font-size: 1.2rem; color: #666;">Seu carrinho está vazio.</div>';
        if(elementoTotal) elementoTotal.textContent = 'R$ 0,00';
        if(elementoSubtotal) elementoSubtotal.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;

    // 4. Desenha cada item (Loop)
    carrinho.forEach((item, index) => {
        const subtotalItem = item.preco * item.quantidade;
        total += subtotalItem;

        const htmlItem = `
            <div class="cart-item">
                <div class="cart-item-product">
                    <img src="${item.imagemUrl}" alt="${item.nome}">
                    <h3>${item.nome}</h3>
                </div>
                <div class="quantity-selector">
                    <button onclick="alterarQtdCarrinho(${index}, -1)">-</button>
                    <span class="quantity">${item.quantidade}</span>
                    <button onclick="alterarQtdCarrinho(${index}, 1)">+</button>
                </div>
                <div class="item-price">${formatarPreco(subtotalItem)}</div>
                <span class="material-symbols-outlined remove-item" onclick="removerItemCarrinho(${index})" style="cursor: pointer;">
                    <img src="/images/excluir.png" alt="Excluir" style="width: 24px;">
                </span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', htmlItem);
    });

    // 5. Atualiza o Total na tela
    if(elementoTotal) elementoTotal.textContent = formatarPreco(total);
    
    // Atualiza o Subtotal também
    const todosValores = document.querySelectorAll('.summary-row span:last-child');
    if(todosValores.length > 0) todosValores[0].textContent = formatarPreco(total);
}

/**
 * Aumenta ou diminui a quantidade de um item
 */
function alterarQtdCarrinho(index, mudanca) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho[index]) {
        carrinho[index].quantidade += mudanca;
        
        // Se a quantidade for para 0, remove o item
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinhoNaTela(); // Redesenha a tela
    }
}

/**
 * Remove um item do carrinho
 */
function removerItemCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1); // Remove 1 item na posição index
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoNaTela(); // Redesenha a tela
}
}