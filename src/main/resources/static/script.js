document.addEventListener('DOMContentLoaded', function () {

    // --- CÓDIGO 0: VALIDAÇÃO AUTOMÁTICA DO CARRINHO (NOVO!) ---
    // Assim que a página abre, verifica se os itens do carrinho ainda existem no banco.
    // Se você apagou o banco de dados, isso vai limpar o carrinho automaticamente.
    validarItensDoCarrinho();

    // =========================================================================
    // 1. LÓGICA GERAL (MODAL, LOGIN, CADASTRO)
    // =========================================================================

    const modal = document.getElementById('auth-modal');
    const userIcon = document.getElementById('user-icon');
    const allViews = document.querySelectorAll('.modal-view');
    const viewLinks = document.querySelectorAll('[data-view]');
    const closeBtn = document.querySelector('.modal-close');

    function showView(viewId) {
        if (allViews && allViews.length > 0) {
            allViews.forEach(view => view.classList.remove('active'));
        }
        const activeView = document.getElementById(viewId);
        if (activeView) activeView.classList.add('active');
    }
    
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            showView('login-view');
        }
    }

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (userIcon) userIcon.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeModal();
        });
    }

    if (viewLinks && viewLinks.length > 0) {
        viewLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const viewId = link.getAttribute('data-view');
                if (viewId) showView(viewId);
            });
        });
    }

    // --- ADMIN: CADASTRO DE PRODUTO ---
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

            if (nome.trim() === '') erros.push('O "Nome" não pode ser vazio.');
            if (isNaN(preco) || preco <= 0) erros.push('O "Preço" deve ser um número válido.');
            
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
                if (!response.ok) throw new Error('Erro ao salvar');
                return response.json();
            })
            .then(produtoSalvo => {
                mensagemFeedback.textContent = `Produto "${produtoSalvo.nome}" salvo com sucesso!`;
                mensagemFeedback.style.color = 'var(--cor-verde-logo)';
                formCadastro.reset();
            })
            .catch(error => {
                mensagemFeedback.textContent = 'Falha ao salvar. Verifique o console.';
                mensagemFeedback.style.color = '#E74C3C';
            });
        });
    }

    // --- LOGIN UNIFICADO ---
    const loginForm = document.querySelector('#login-view form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const emailInput = loginForm.querySelector('input[type="email"]');
            const senhaInput = loginForm.querySelector('input[type="password"]');
            const dadosLogin = { email: emailInput.value, senha: senhaInput.value };

            try {
                const userResponse = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosLogin)
                });

                if (userResponse.ok) {
                    const usuarioLogado = await userResponse.json();
                    
                    if (usuarioLogado.admin === true) {
                        localStorage.setItem('adminLogado', 'true');
                        localStorage.setItem('usuarioLogado', usuarioLogado.nome);
                        localStorage.setItem('usuarioEmail', usuarioLogado.email);
                        alert('Login de admin bem-sucedido!');
                        window.location.href = '/admin.html';
                    } else {
                        localStorage.setItem('usuarioLogado', usuarioLogado.nome);
                        localStorage.setItem('usuarioEmail', usuarioLogado.email);
                        localStorage.removeItem('adminLogado'); 
                        alert('Login bem-sucedido! Bem-vindo(a), ' + usuarioLogado.nome + '!');
                        window.location.reload();
                    }
                } else {
                    const mensagemErro = await userResponse.text();
                    alert('Falha no login: ' + mensagemErro);
                }
            } catch (error) {
                alert('Erro de conexão com o servidor.');
            }
        });
    }

    // --- REGISTRO DE USUÁRIO ---
    const registerForm = document.querySelector('#register-view form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const email = registerForm.querySelector('input[type="email"]').value;
            const nome = registerForm.querySelector('input[type="text"]').value;
            const telefone = registerForm.querySelector('input[type="tel"]').value;
            const senha = registerForm.querySelector('input[type="password"]').value;

            const novoUsuario = { nome, email, telefone, senha };

            try {
                const response = await fetch('/api/usuarios/registar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                });

                if (response.ok) {
                    alert('Conta criada com sucesso! Faça o login agora.');
                    showView('login-view'); 
                } else {
                    const mensagemErro = await response.text();
                    alert('Falha no registro: ' + mensagemErro);
                }
            } catch (error) {
                alert('Erro de conexão com o servidor.');
            }
        });
    }

    // --- HEADER DINÂMICO (LOGIN/LOGOUT) ---
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    if (nomeUsuario) {
        const iconeEsquerda = document.querySelector('.header-icone-esquerda');
        const iconeLogin = document.getElementById('user-icon');
        const iconeDireita = document.querySelector('.header-icone-direita');

        // Esquerda: "Olá, Nome"
        if (iconeEsquerda && iconeLogin) {
            iconeLogin.style.display = 'none'; 
            const htmlOla = `<div class="user-info" style="color: white; display: flex; align-items: center; height: 35px;"><span>Olá, ${nomeUsuario}</span></div>`;
            iconeEsquerda.insertAdjacentHTML('beforeend', htmlOla);
        }
        
        // Direita: Botão Sair (Imagem)
        if (iconeDireita) {
            const htmlLogout = `<a id="logout-btn" style="cursor: pointer;" title="Sair"><img src="/images/sign_out.png" class="material-symbols-outlined" alt="Sair" style="width: 30px; height: 30px;"></a>`;
            iconeDireita.insertAdjacentHTML('afterbegin', htmlLogout);
        }
    }
    
    // Logout Geral
    document.addEventListener('click', function(e) {
        if (e.target.closest('#logout-btn')) {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('usuarioEmail');
                localStorage.removeItem('adminLogado');
                window.location.reload();
            }
        }
        // Logout Admin
        if (e.target.closest('#admin-logout-icon')) {
            if (confirm("Deseja sair do painel administrativo?")) {
                localStorage.removeItem('adminLogado');
                window.location.href = '/index.html';
            }
        }
    });

    // Segurança Admin
    const formAdmin = document.getElementById('form-cadastro-produto');
    if (formAdmin) {
        const isAdmin = localStorage.getItem('adminLogado');
        if (isAdmin !== 'true') {
            alert('Acesso negado.');
            window.location.href = '/index.html';
        }
    }

    // --- CARREGAR GRADES DE PRODUTOS (HOME) ---
    const todasAsGrids = document.querySelectorAll('.product-section .product-grid');
    if (todasAsGrids.length > 0) {
        todasAsGrids.forEach((grid, index) => {
            carregarProdutos(grid, index);
        });
    }

    // --- CARREGAR PRODUTO ESPECÍFICO ---
    const layoutProduto = document.querySelector('.product-detail-layout');
    if (layoutProduto) {
        carregarProdutoEspecifico(layoutProduto);
    }

    // --- MÁSCARA DE CEP ---
    const inputCEP = document.querySelector('.frete-input input');
    if (inputCEP) {
        inputCEP.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, "");
            if (valor.length > 5) {
                valor = valor.slice(0, 5) + "-" + valor.slice(5, 8);
            }
            e.target.value = valor;
        });
    }


    // =========================================================================
    // 2. LÓGICA DO CARRINHO
    // =========================================================================

    const listaCarrinho = document.querySelector('.cart-list');
    if (listaCarrinho) {
        
        atualizarCarrinhoNaTela();

        listaCarrinho.addEventListener('click', function(e) {
            const btnRemover = e.target.closest('.remove-item');
            const btnQtd = e.target.closest('.btn-qtd');

            if (btnRemover) {
                const index = parseInt(btnRemover.dataset.index);
                removerItemCarrinho(index);
            }

            if (btnQtd) {
                const index = parseInt(btnQtd.dataset.index);
                const action = btnQtd.dataset.action;
                
                if (action === 'increase') alterarQtdCarrinho(index, 1);
                if (action === 'decrease') alterarQtdCarrinho(index, -1);
            }
        });
    }

}); // <-- FIM DO DOMContentLoaded


// ===================================================================================
// FUNÇÕES AUXILIARES E LÓGICA DO CARRINHO
// ===================================================================================

function getChaveCarrinho() {
    const email = localStorage.getItem('usuarioEmail');
    return email ? `carrinho_${email}` : 'carrinho_visitante';
}

/**
 * (NOVA FUNÇÃO) Verifica se os itens do carrinho ainda existem no banco.
 * Se o banco foi apagado, esta função vai limpar os itens inválidos.
 */
async function validarItensDoCarrinho() {
    const chave = getChaveCarrinho();
    let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    
    if (carrinho.length === 0) return;

    const carrinhoValidado = [];
    let houveAlteracao = false;

    for (const item of carrinho) {
        try {
            // Tenta buscar o produto no banco para ver se ele existe
            const response = await fetch(`/api/produtos/${item.id}`);
            if (response.ok) {
                // Se o servidor respondeu OK (200), o produto existe
                carrinhoValidado.push(item);
            } else {
                // Se respondeu 404, o produto não existe mais (banco foi apagado)
                houveAlteracao = true;
                console.log(`Produto ID ${item.id} removido pois não existe no banco.`);
            }
        } catch (error) {
            // Se houve erro de rede, mantemos o item por segurança
            carrinhoValidado.push(item);
        }
    }

    if (houveAlteracao) {
        localStorage.setItem(chave, JSON.stringify(carrinhoValidado));
        // Se estiver na tela do carrinho, atualiza visualmente
        if (document.querySelector('.cart-list')) {
            atualizarCarrinhoNaTela();
        }
    }
}

function atualizarCarrinhoNaTela() {
    const container = document.querySelector('.cart-list');
    const elementoTotal = document.querySelector('.summary-row.total span:last-child');
    const elementoSubtotal = document.querySelector('.summary-row span:last-child');
    
    if (!container) return;

    const chave = getChaveCarrinho();
    const carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    container.innerHTML = '';

    if (carrinho.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center;">Seu carrinho está vazio.</div>';
        if(elementoTotal) elementoTotal.textContent = 'R$ 0,00';
        if(elementoSubtotal) elementoSubtotal.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;

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
                    <button class="btn-qtd" data-action="decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantidade}</span>
                    <button class="btn-qtd" data-action="increase" data-index="${index}">+</button>
                </div>
                <div class="item-price">${formatarPreco(subtotalItem)}</div>
                <span class="material-symbols-outlined remove-item" data-index="${index}" style="cursor: pointer;">
                    <img src="/images/excluir.png" alt="Excluir" style="width: 24px; pointer-events: none;">
                </span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', htmlItem);
    });

    const totalFormatado = formatarPreco(total);
    if(elementoTotal) elementoTotal.textContent = totalFormatado;
    if(elementoSubtotal) elementoSubtotal.textContent = totalFormatado;
}

function alterarQtdCarrinho(index, mudanca) {
    const chave = getChaveCarrinho();
    let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    
    if (carrinho[index]) {
        carrinho[index].quantidade += mudanca;
        if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
        localStorage.setItem(chave, JSON.stringify(carrinho));
        atualizarCarrinhoNaTela();
    }
}

function removerItemCarrinho(index) {
    const chave = getChaveCarrinho();
    let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    carrinho.splice(index, 1); 
    localStorage.setItem(chave, JSON.stringify(carrinho));
    atualizarCarrinhoNaTela();
}

async function carregarProdutos(gridElement, secaoIndex) {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error('Erro');
        const produtos = await response.json();

        gridElement.innerHTML = '';
        if (produtos.length === 0) {
            gridElement.innerHTML = '<p style="color: white;">Nenhum produto cadastrado.</p>';
            return;
        }

        const produtosPorSecao = 4;
        const inicio = secaoIndex * produtosPorSecao;
        const fim = inicio + produtosPorSecao;
        const produtosDaSecao = produtos.slice(inicio, fim);

        produtosDaSecao.forEach(produto => {
            const cardHTML = `
                <div class="product-card">
                    <a href="/produto.html?id=${produto.id}"> 
                        <img src="${produto.imagemUrl}" alt="${produto.nome}">
                    </a>
                    <div class="product-card-info">
                        <h3>${produto.nome}</h3>
                        <div class="product-card-rating">${gerarEstrelas(produto.avaliacao)}</div>
                        <div class="product-card-price">${formatarPreco(produto.preco)}</div>
                    </div>
                </div>
            `;
            gridElement.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function carregarProdutoEspecifico(layout) {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) return;

        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) throw new Error('Produto não encontrado');
        const produto = await response.json();

        layout.querySelector('h1').textContent = produto.nome;
        layout.querySelector('p.description').textContent = produto.descricao;
        layout.querySelector('.price').textContent = formatarPreco(produto.preco);
        const img = layout.querySelector('.main-image img');
        img.src = produto.imagemUrl;
        img.alt = produto.nome;
        document.title = produto.nome + " - Jardim Encantado";

        const btnAdicionar = layout.querySelector('.btn-primary');
        const linkBotao = btnAdicionar.parentElement;
        if (linkBotao.tagName === 'A') linkBotao.replaceWith(btnAdicionar);

        const novoBtn = btnAdicionar.cloneNode(true);
        if(btnAdicionar.parentNode) btnAdicionar.parentNode.replaceChild(novoBtn, btnAdicionar);

        novoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const chave = getChaveCarrinho();
            let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
            const itemExistente = carrinho.find(item => item.id === produto.id);

            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagemUrl: produto.imagemUrl,
                    quantidade: 1
                });
            }
            localStorage.setItem(chave, JSON.stringify(carrinho));
            alert('Produto adicionado ao carrinho!');
            window.location.href = '/comprar.html';
        });

    } catch (error) {
        console.error(error);
    }
}

function gerarEstrelas(avaliacao) {
    let estrelasHTML = '';
    const nota = parseInt(avaliacao) || 0;
    for (let i = 1; i <= 5; i++) {
        estrelasHTML += i <= nota ? '<span>★</span>' : '<span>☆</span>';
    }
    return estrelasHTML;
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}