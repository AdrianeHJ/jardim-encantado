// Garante que todo o JS só rode após o HTML ser 100% carregado.
document.addEventListener('DOMContentLoaded', function () {

    // --- Bloco 1: LÓGICA DO MODAL (Abrir, Fechar, Trocar Telas) ---
    const modal = document.getElementById('auth-modal');
    const userIcon = document.getElementById('user-icon');
    const allViews = document.querySelectorAll('.modal-view');
    const viewLinks = document.querySelectorAll('[data-view]');
    const closeBtn = document.querySelector('.modal-close');

    function showView(viewId) {
        if (allViews && allViews.length > 0) {
            allViews.forEach(view => {
                view.classList.remove('active');
            });
        }
        const activeView = document.getElementById(viewId);
        if (activeView) {
            activeView.classList.add('active');
        } else {
            console.error('Erro: View do modal com id "' + viewId + '" não foi encontrada.');
        }
    }

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            showView('login-view');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    if (userIcon) {
        userIcon.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (viewLinks && viewLinks.length > 0) {
        viewLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const viewId = link.getAttribute('data-view');
                if (viewId) {
                    showView(viewId);
                }
            });
        });
    }

    // --- Bloco 2: LÓGICA DO LOGOUT DO ADMIN (Página Admin) ---
    const adminLogoutIcon = document.getElementById('admin-logout-icon');

    if (adminLogoutIcon) {
        adminLogoutIcon.addEventListener('click', function () {
            if (confirm("Deseja sair do painel administrativo e voltar para a página inicial?")) {
                localStorage.removeItem('adminLogado');
                window.location.href = '/index.html';
            }
        });
    }

    // --- Bloco 3: LÓGICA DE CADASTRO DE PRODUTO (Página Admin) ---
    const formCadastro = document.getElementById('form-cadastro-produto');

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (evento) {
            evento.preventDefault();

            const mensagemFeedback = document.getElementById('feedback-mensagem');
            let erros = [];

            const nome = document.getElementById('produto-nome').value;
            const descricao = document.getElementById('produto-descricao').value;
            const imagemUrl = document.getElementById('produto-imagemUrl').value;
            const precoString = document.getElementById('produto-preco').value;
            const precoFormatado = precoString.replace(",", ".");
            const preco = parseFloat(precoFormatado);
            const avaliacao = parseInt(document.getElementById('produto-avaliacao').value);

            if (nome.trim() === '') { erros.push('O "Nome" não pode ser vazio.'); }
            if (descricao.trim() === '') { erros.push('A "Descrição" não pode ser vazia.'); }
            if (imagemUrl.trim() === '') { erros.push('A "URL da Imagem" não pode ser vazia.'); }
            if (isNaN(preco) || preco <= 0) { erros.push('O "Preço" deve ser um número válido (ex: 99,90).'); }
            if (isNaN(avaliacao) || avaliacao < 1 || avaliacao > 5) { erros.push('A "Avaliação" deve ser de 1 a 5.'); }
            if (/^[0-9]+$/.test(nome.trim())) { erros.push('O "Nome" não pode ser só números.'); }

            if (erros.length > 0) {
                mensagemFeedback.style.color = '#E74C3C';
                mensagemFeedback.innerHTML = erros.join('<br>');
                return;
            }

            mensagemFeedback.textContent = 'Salvando...';
            mensagemFeedback.style.color = '#FFF';

            const produto = {
                nome: nome.trim(),
                descricao: descricao.trim(),
                preco: preco,
                avaliacao: avaliacao,
                imagemUrl: imagemUrl.trim()
            };

            fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao salvar');
                    }
                    return response.json();
                })
                .then(produtoSalvo => {
                    mensagemFeedback.textContent = `Produto "${produtoSalvo.nome}" salvo com ID: ${produtoSalvo.id}!`;
                    mensagemFeedback.style.color = 'var(--cor-verde-logo)';
                    formCadastro.reset();
                })
                .catch(error => {
                    mensagemFeedback.textContent = 'Falha ao salvar. Verifique o console (F12).';
                    mensagemFeedback.style.color = '#E74C3C';
                });
        });
    }

    // --- Bloco 4: INICIALIZADOR DE CARREGAMENTO DE PRODUTOS (Página Inicial) ---
    // (Esta parte apenas ENCONTRA as prateleiras e chama a função 'carregarProdutos' para cada uma)
    const todasAsGrids = document.querySelectorAll('.product-section .product-grid');

    if (todasAsGrids.length > 0) {
        todasAsGrids.forEach((grid, index) => {
            // A função 'carregarProdutos' (definida no final) é chamada aqui
            carregarProdutos(grid, index);
        });
    }

    // --- Bloco 5: LÓGICA DE LOGIN (Admin E Usuário) ---
    const loginForm = document.querySelector('#login-view form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const emailInput = loginForm.querySelector('input[type="email"]');
            const senhaInput = loginForm.querySelector('input[type="password"]');

            const dadosLogin = {
                email: emailInput.value,
                senha: senhaInput.value
            };

            try {
                // ---> Início da Lógica de Login do Admin (como solicitado)
                const adminResponse = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosLogin)
                });

                if (adminResponse.ok) {
                    localStorage.setItem('adminLogado', 'true');
                    alert('Login de admin bem-sucedido!');
                    window.location.href = '/admin.html';
                    return; // Encerra a função aqui
                }
                // ---> Fim da Lógica de Login do Admin

                // ---> Início da Lógica de Login do Usuário
                const userResponse = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosLogin)
                });

                if (userResponse.ok) {
                    const usuarioLogado = await userResponse.json();
                    alert('Login bem-sucedido! Bem-vindo(a), ' + usuarioLogado.nome + '!');
                    localStorage.setItem('usuarioLogado', usuarioLogado.nome);
                    window.location.reload();
                    closeModal();
                } else {
                    const mensagemErro = await userResponse.text();
                    alert('Falha no login: ' + mensagemErro);
                }

            } catch (error) {
                console.error('Erro ao tentar logar:', error);
                alert('Erro de conexão com o servidor.');
            }
        });
    }

    // --- Bloco 6: LÓGICA DE CARREGAR PRODUTO ESPECÍFICO (Página Produto) ---
    const layoutProduto = document.querySelector('.product-detail-layout');

    if (layoutProduto) {
        carregarProdutoEspecifico(layoutProduto);
    }

    // (Note que a definição da função 'carregarProdutoEspecifico' está aqui dentro do DOMContentLoaded)
    async function carregarProdutoEspecifico(layout) {
        try {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            if (!id) {
                layout.innerHTML = "<h1>Produto não encontrado (ID não fornecido).</h1>";
                return;
            }

            const response = await fetch(`/api/produtos/${id}`);

            if (!response.ok) {
                throw new Error('Produto não encontrado ou erro no servidor.');
            }

            const produto = await response.json();
            const titulo = layout.querySelector('h1');
            const descricao = layout.querySelector('p.description');
            const preco = layout.querySelector('.price');
            const imagemPrincipal = layout.querySelector('.main-image img');

            document.title = produto.nome + " - Jardim Encantado";
            titulo.textContent = produto.nome;
            descricao.textContent = produto.descricao;
            preco.textContent = formatarPreco(produto.preco);
            imagemPrincipal.src = produto.imagemUrl;
            imagemPrincipal.alt = produto.nome;

        } catch (error) {
            console.error("Erro ao carregar produto:", error);
            layout.innerHTML = `<h1 style='color: red;'>Erro ao carregar produto.</h1><p>${error.message}</p>`;
        }
    }
    
    // --- Bloco 7: LÓGICA DE REGISTRO DE NOVO USUÁRIO ---
    const registerForm = document.querySelector('#register-view form');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = registerForm.querySelector('input[type="email"]').value;
            const nome = registerForm.querySelector('input[type="text"]').value;
            const telefone = registerForm.querySelector('input[type="tel"]').value;
            const senha = registerForm.querySelector('input[type="password"]').value;

            const novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha
            };

            try {
                const response = await fetch('/api/usuarios/registar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoUsuario)
                });

                if (response.ok) {
                    const usuarioSalvo = await response.json();
                    alert('Conta criada com sucesso para ' + usuarioSalvo.nome + '! Faça o login agora.');
                    showView('login-view');
                } else {
                    const mensagemErro = await response.text();
                    alert('Falha no registro: ' + mensagemErro);
                }
            } catch (error) {
                console.error('Erro ao tentar registrar:', error);
                alert('Erro de conexão com o servidor. Verifique o console (F12).');
            }
        });
    }

    // --- Bloco 8: LÓGICA DE VERIFICAÇÃO DE LOGIN (Header) ---
    // (Mostra "Olá, Nome" ou o ícone de login)
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    if (nomeUsuario) {
        const iconeLogin = document.getElementById('user-icon');
        const iconeEsquerda = iconeLogin.parentElement;

        iconeLogin.style.display = 'none';

        iconeEsquerda.innerHTML += `
        <div class="user-info" style="color: white; display: flex; align-items: center; gap: 1rem;">
            <span>Olá, ${nomeUsuario}</span>
            <a id="logout-btn" style="cursor: pointer; color: #f0f0f0; text-decoration: underline;">Sair</a>
        </div>
    `;
    }
    
    // (Lógica do botão "Sair" do usuário)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('usuarioLogado');
                window.location.reload();
            }
        });
    }

    // --- Bloco 9: "SEGURANÇA" DA PÁGINA ADMIN ---
    // (Verifica se 'adminLogado' está no localStorage)
    const formAdmin = document.getElementById('form-cadastro-produto');

    if (formAdmin) {
        const isAdmin = localStorage.getItem('adminLogado');

        if (isAdmin !== 'true') {
            alert('Acesso negado. Você precisa fazer login como administrador.');
            window.location.href = '/index.html';
        }
    }

}); // <-- FIM DO 'DOMContentLoaded'


/**
 * ===================================================================================
 * FUNÇÕES AUXILIARES (Definidas fora do 'DOMContentLoaded')
 * ===================================================================================
 */


// ---> Início da Função de Listar/Carregar Produtos (como solicitado)
// (Busca os produtos na API e os desenha na tela)
async function carregarProdutos(gridElement, secaoIndex) {
    try {
        // (Aqui é feita a chamada GET para /api/produtos)
        const response = await fetch('/api/produtos');

        if (!response.ok) {
            throw new Error('Não foi possível buscar os produtos. Status: ' + response.status);
        }

        const produtos = await response.json();
        gridElement.innerHTML = '';

        if (produtos.length === 0) {
            gridElement.innerHTML = '<p style="color: white; grid-column: 1 / -1;">Nenhum produto cadastrado ainda. Cadastre produtos na página de <a href="/admin.html" style="color: var(--cor-verde-logo); text-decoration: underline;">Admin</a>.</p>';
            return;
        }

        const produtosPorSecao = 4;
        const inicio = secaoIndex * produtosPorSecao;
        const fim = inicio + produtosPorSecao;
        const produtosDaSecao = produtos.slice(inicio, fim);

        // (Cria os cards de produto)
        produtosDaSecao.forEach(produto => {
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
            gridElement.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        gridElement.innerHTML = '<p style="color: red; grid-column: 1 / -1;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}
// ---> Fim da Função de Listar/Carregar Produtos


// --- Função Auxiliar: Gerar Estrelas ---
function gerarEstrelas(avaliacao) {
    let estrelasHTML = '';
    const nota = parseInt(avaliacao) || 0;
    for (let i = 1; i <= 5; i++) {
        if (i <= nota) {
            estrelasHTML += '<span>★</span>';
        } else {
            estrelasHTML += '<span>☆</span>';
        }
    }
    return estrelasHTML;
}

// --- Função Auxiliar: Formatar Preço ---
function formatarPreco(preco) {
    const numeroPreco = Number(preco);
    return numeroPreco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}