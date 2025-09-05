document.addEventListener('DOMContentLoaded', function () {
    const btnAddPessoa = document.getElementById('btn-add-pessoa');
    const btnAddResponsavel = document.getElementById('btn-add-responsavel');
    const tabelaPessoas = document.getElementById('tabela-pessoas');
    const tabelaResponsaveis = document.getElementById('tabela-responsaveis');
    
    const pessoaNomeCompletoInput = document.getElementById('pessoa-nome-completo');
    const pessoaNomeGuerraInput = document.getElementById('pessoa-nome-guerra');
    const respNomeInput = document.getElementById('resp-nome');
    const respPostoInput = document.getElementById('resp-posto');
    const respFuncaoInput = document.getElementById('resp-funcao');

    let bancoDePessoas = JSON.parse(localStorage.getItem('bancoDePessoas')) || [];
    let bancoDeResponsaveis = JSON.parse(localStorage.getItem('bancoDeResponsaveis')) || [];

    function renderizarPessoas() {
        tabelaPessoas.innerHTML = '';
        bancoDePessoas.forEach((pessoa, index) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${pessoa.nomeCompleto}</td>
                <td>${pessoa.nomeGuerra}</td>
                <td><button class="btn btn-danger btn-sm" data-index="${index}">X</button></td>
            `;
            tabelaPessoas.appendChild(linha);
        });
    }

    function renderizarResponsaveis() {
        tabelaResponsaveis.innerHTML = '';
        bancoDeResponsaveis.forEach((resp, index) => {
            const linha = `<tr>
                <td>${resp.nome}</td>
                <td>${resp.funcao}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removerResponsavel(${index})">X</button></td>
            </tr>`;
            tabelaResponsaveis.innerHTML += linha;
        });
    }
    
    // --- NOVA FUNÇÃO PARA REMOVER PESSOA (MAIS SEGURA) ---
    tabelaPessoas.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn-danger')) {
            const index = event.target.getAttribute('data-index');
            if (confirm('Tem certeza que deseja remover esta pessoa permanentemente?')) {
                bancoDePessoas.splice(index, 1);
                localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
                renderizarPessoas();
            }
        }
    });


    window.removerResponsavel = function(index) {
        if (confirm('Tem certeza que deseja remover este responsável permanentemente?')) {
            bancoDeResponsaveis.splice(index, 1);
            localStorage.setItem('bancoDeResponsaveis', JSON.stringify(bancoDeResponsaveis));
            renderizarResponsaveis();
        }
    }

    btnAddPessoa.addEventListener('click', () => {
        const nomeCompleto = pessoaNomeCompletoInput.value.trim();
        const nomeGuerra = pessoaNomeGuerraInput.value.trim().toUpperCase();
        
        if (nomeCompleto && nomeGuerra) {
            bancoDePessoas.push({ nomeCompleto, nomeGuerra });
            localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
            renderizarPessoas();
            pessoaNomeCompletoInput.value = '';
            pessoaNomeGuerraInput.value = '';
        }
    });

    btnAddResponsavel.addEventListener('click', () => {
        const nome = respNomeInput.value.trim();
        const posto = respPostoInput.value.trim().toUpperCase();
        const funcao = respFuncaoInput.value.trim().toUpperCase();
        
        if (nome && posto && funcao) {
            bancoDeResponsaveis.push({ nome, posto, funcao });
            localStorage.setItem('bancoDeResponsaveis', JSON.stringify(bancoDeResponsaveis));
            renderizarResponsaveis();
            respNomeInput.value = '';
            respPostoInput.value = '';
            respFuncaoInput.value = '';
        }
    });

    // --- CÓDIGO PARA ATIVAR A FUNÇÃO DE ARRASTAR E SALVAR A NOVA ORDEM ---
    new Sortable(tabelaPessoas, {
        animation: 150,
        onEnd: function (evt) {
            // Pega o item que foi movido
            const itemMovido = bancoDePessoas.splice(evt.oldIndex, 1)[0];
            // Insere o item na nova posição
            bancoDePessoas.splice(evt.newIndex, 0, itemMovido);
            // Salva a nova ordem no localStorage
            localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
            // Renderiza a tabela novamente para atualizar os índices dos botões
            renderizarPessoas(); 
        }
    });

    renderizarPessoas();
    renderizarResponsaveis();
});
