document.addEventListener('DOMContentLoaded', function () {

    // --- CÓDIGO 0: VALIDAÇÃO E ATUALIZAÇÃO GERAL ---
    validarItensDoCarrinho();
    atualizarPrecosCheckout(); 

    // =========================================================================
    // LÓGICA DE PERSONALIZADOS
    // =========================================================================
    const formPersonalizados = document.getElementById('form-personalizados');
    const displayTotal = document.getElementById('total-display');

    if (formPersonalizados) {
        function calcularTotalPersonalizado() {
            let total = 0;
            const selecionados = formPersonalizados.querySelectorAll('input:checked');
            
            selecionados.forEach(input => {
                const preco = parseFloat(input.getAttribute('data-preco')) || 0;
                total += preco;
            });
            
            if(displayTotal) {
                displayTotal.textContent = formatarPreco(total);
            }
            return total;
        }

        formPersonalizados.addEventListener('change', calcularTotalPersonalizado);

        formPersonalizados.addEventListener('submit', function(e) {
            e.preventDefault();
            const total = calcularTotalPersonalizado();
            
            const tamanhoSelecionado = formPersonalizados.querySelector('input[name="tamanho"]:checked');
            if (!tamanhoSelecionado) {
                alert("Por favor, selecione o tamanho do buquê.");
                return;
            }

            let itensEscolhidos = [];
            formPersonalizados.querySelectorAll('input:checked').forEach(input => {
                itensEscolhidos.push(input.value);
            });

            const produtoCustom = {
                id: 'custom_' + new Date().getTime(), 
                nome: 'Buquê Personalizado',
                descricao: 'Itens: ' + itensEscolhidos.join(', '),
                preco: total,
                imagemUrl: '/images/LogoSemFundo.png', 
                quantidade: 1
            };

            const chave = getChaveCarrinho();
            let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
            carrinho.push(produtoCustom);
            localStorage.setItem(chave, JSON.stringify(carrinho));

            alert('Seu buquê personalizado foi adicionado ao carrinho!');
            window.location.href = '/comprar.html';
        });
    }

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

    // --- ADMIN ---
    const formCadastro = document.getElementById('form-cadastro-produto');
    const selectPagina = document.getElementById('produto-pagina');
    const selectSecao = document.getElementById('produto-secao');

    const secoesPorPagina = {
        'home': [
            { valor: 'promocoes', texto: 'Promoções' },
            { valor: 'mais_vendidos', texto: 'Mais Vendidos' }
        ],
        'buques': [
            { valor: 'novidades', texto: 'Novidades' },
            { valor: 'promocoes', texto: 'Promoções' },
            { valor: 'frete_gratis', texto: 'Frete Grátis' }
        ],
        'conjuntos': [
            { valor: 'novidades', texto: 'Novidades' },
            { valor: 'promocoes', texto: 'Promoções' },
            { valor: 'frete_gratis', texto: 'Frete Grátis' }
        ],
        'mudas': [
            { valor: 'novidades', texto: 'Novidades' },
            { valor: 'promocoes', texto: 'Promoções' },
            { valor: 'frete_gratis', texto: 'Frete Grátis' }
        ]
    };

    if (selectPagina && selectSecao) {
        selectPagina.addEventListener('change', function() {
            const paginaSelecionada = this.value;
            const opcoes = secoesPorPagina[paginaSelecionada];

            selectSecao.innerHTML = '<option value="" disabled selected>Escolha a Seção...</option>';

            if (opcoes) {
                selectSecao.disabled = false;
                opcoes.forEach(opcao => {
                    const elementOption = document.createElement('option');
                    elementOption.value = opcao.valor;
                    elementOption.textContent = opcao.texto;
                    selectSecao.appendChild(elementOption);
                });
            } else {
                selectSecao.disabled = true;
            }
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (evento) {
            evento.preventDefault();
            const mensagemFeedback = document.getElementById('feedback-mensagem');
            
            const nome = document.getElementById('produto-nome').value;
            const descricao = document.getElementById('produto-descricao').value;
            const imagemUrl = document.getElementById('produto-imagemUrl').value;
            const preco = parseFloat(document.getElementById('produto-preco').value.replace(",", "."));
            const avaliacao = parseInt(document.getElementById('produto-avaliacao').value);
            const pagina = document.getElementById('produto-pagina').value;
            const secao = document.getElementById('produto-secao').value;

            const produto = {
                nome, descricao, preco, avaliacao, imagemUrl, pagina, secao
            };

            fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            })
            .then(res => {
                if(res.ok) {
                    mensagemFeedback.textContent = "Produto salvo com sucesso!";
                    mensagemFeedback.style.color = 'var(--cor-verde-logo)';
                    formCadastro.reset();
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                mensagemFeedback.textContent = "Erro ao salvar.";
                mensagemFeedback.style.color = 'red';
            });
        });
    }

    // --- LOGIN E REGISTRO ---
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

    // --- HEADER DINÂMICO ---
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    if (nomeUsuario) {
        const iconeEsquerda = document.querySelector('.header-icone-esquerda');
        const iconeLogin = document.getElementById('user-icon');
        const iconeDireita = document.querySelector('.header-icone-direita');

        if (iconeEsquerda && iconeLogin) {
            iconeLogin.style.display = 'none'; 
            const htmlOla = `<div class="user-info" style="color: white; display: flex; align-items: center; height: 35px;"><span>Olá, ${nomeUsuario}</span></div>`;
            iconeEsquerda.insertAdjacentHTML('beforeend', htmlOla);
        }
        
        if (iconeDireita) {
            const htmlLogout = `<a id="logout-btn" style="cursor: pointer;" title="Sair"><img src="/images/sign_out.png" class="material-symbols-outlined" alt="Sair" style="width: 30px; height: 30px;"></a>`;
            iconeDireita.insertAdjacentHTML('afterbegin', htmlLogout);
        }
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('#logout-btn')) {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('usuarioEmail');
                localStorage.removeItem('adminLogado');
                window.location.reload();
            }
        }
    });

    const formAdmin = document.getElementById('form-cadastro-produto');
    if (formAdmin) {
        const isAdmin = localStorage.getItem('adminLogado');
        if (isAdmin !== 'true') {
            alert('Acesso negado.');
            window.location.href = '/index.html';
        }
    }

    // --- CARROSSEL ---
    const grids = document.querySelectorAll('.product-grid');
    if (grids.length > 0) {
        fetch('/api/produtos')
            .then(res => res.json())
            .then(todosProdutos => {
                grids.forEach(grid => {
                    const pAlvo = grid.getAttribute('data-pagina');
                    const sAlvo = grid.getAttribute('data-secao');

                    const filtrados = todosProdutos.filter(p => p.pagina === pAlvo && p.secao === sAlvo);

                    grid.innerHTML = '';
                    
                    const container = grid.parentElement;
                    const btnPrev = container.querySelector('.arrow-prev');
                    const btnNext = container.querySelector('.arrow-next');

                    if (filtrados.length === 0) {
                        grid.innerHTML = '<p style="color:#ccc; padding:1rem;">Sem produtos aqui.</p>';
                        if(btnPrev) btnPrev.style.display = 'none';
                        if(btnNext) btnNext.style.display = 'none';
                    } else {
                        if(btnPrev) btnPrev.style.display = 'flex';
                        if(btnNext) btnNext.style.display = 'flex';

                        if (filtrados.length <= 4) {
                            if(btnPrev) btnPrev.style.display = 'none';
                            if(btnNext) btnNext.style.display = 'none';
                        }

                        filtrados.forEach(prod => {
                            const card = `
                                <div class="product-card">
                                    <a href="/produto.html?id=${prod.id}"> 
                                        <img src="${prod.imagemUrl}" alt="${prod.nome}">
                                    </a>
                                    <div class="product-card-info">
                                        <h3>${prod.nome}</h3>
                                        <div class="product-card-rating">${gerarEstrelas(prod.avaliacao)}</div>
                                        <div class="product-card-price">${formatarPreco(prod.preco)}</div>
                                    </div>
                                </div>`;
                            grid.insertAdjacentHTML('beforeend', card);
                        });
                    }
                });
            })
            .catch(err => console.error("Erro ao carregar produtos:", err));
    }

    document.querySelectorAll('.slider-arrow').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.parentElement.querySelector('.product-grid');
            const scroll = 300;
            if (btn.classList.contains('arrow-next')) container.scrollBy({ left: scroll, behavior: 'smooth' });
            else container.scrollBy({ left: -scroll, behavior: 'smooth' });
        });
    });

    const layoutProduto = document.querySelector('.product-detail-layout');
    if (layoutProduto) {
        carregarProdutoEspecifico(layoutProduto);
    }

    // --- MÁSCARA CEP ---
    // MUDANÇA: Agora pegamos pelo ID 'cep-input' para garantir que é o certo
    const inputCEP = document.getElementById('cep-input');
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
    // 2. LÓGICA DO CARRINHO E CHECKOUT
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

    // >>>> NOVA VALIDAÇÃO DE FRETE OBRIGATÓRIO <<<<
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function(e) {
            
            // 1. Valida se o número do CEP foi digitado corretamente
            const cepInput = document.getElementById('cep-input');
            // Remove traço e tudo que não for número para contar os dígitos
            const cepValor = cepInput ? cepInput.value.replace(/\D/g, '') : '';

            if (cepValor.length !== 8) {
                e.preventDefault(); // Bloqueia o clique
                alert("Por favor, digite um CEP válido (8 números) antes de finalizar.");
                if(cepInput) cepInput.focus(); // Leva o cursor para o campo
                return; // Para a execução aqui
            }

            // 2. Valida se uma opção de frete (bolinha) foi selecionada
            const freteSelecionado = document.querySelector('input[name="frete"]:checked');
            
            if (!freteSelecionado) {
                e.preventDefault(); // Bloqueia o clique
                alert("Por favor, selecione uma opção de frete (PAC, SEDEX ou Grátis) para continuar.");
                // Rola a tela até a calculadora de frete
                document.querySelector('.frete-calculator').scrollIntoView({behavior: 'smooth'});
            }
        });
    }

}); 

// ===================================================================================
// FUNÇÕES AUXILIARES
// ===================================================================================

function getChaveCarrinho() {
    const email = localStorage.getItem('usuarioEmail');
    return email ? `carrinho_${email}` : 'carrinho_visitante';
}

function atualizarPrecosCheckout() {
    const chave = getChaveCarrinho();
    const carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
    });

    const totalFormatado = formatarPreco(total);

    const subtotais = document.querySelectorAll('.checkout-subtotal');
    subtotais.forEach(el => el.textContent = totalFormatado);

    const totais = document.querySelectorAll('.checkout-total');
    totais.forEach(el => el.textContent = totalFormatado);
}

async function validarItensDoCarrinho() {
    const chave = getChaveCarrinho();
    let carrinho = JSON.parse(localStorage.getItem(chave)) || [];
    
    if (carrinho.length === 0) return;

    const carrinhoValidado = [];
    let houveAlteracao = false;

    for (const item of carrinho) {
        if (item.id.toString().startsWith('custom')) {
            carrinhoValidado.push(item);
            continue;
        }

        try {
            const response = await fetch(`/api/produtos/${item.id}`);
            if (response.ok) {
                carrinhoValidado.push(item);
            } else {
                houveAlteracao = true;
            }
        } catch (error) {
            carrinhoValidado.push(item);
        }
    }

    if (houveAlteracao) {
        localStorage.setItem(chave, JSON.stringify(carrinhoValidado));
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

        const descricaoHtml = item.descricao ? `<p style="font-size:0.8rem; color:#666; margin-top:0.2rem;">${item.descricao}</p>` : '';

        const htmlItem = `
            <div class="cart-item">
                <div class="cart-item-product">
                    <img src="${item.imagemUrl}" alt="${item.nome}">
                    <div>
                        <h3>${item.nome}</h3>
                        ${descricaoHtml}
                    </div>
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