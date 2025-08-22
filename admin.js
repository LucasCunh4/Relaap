document.addEventListener('DOMContentLoaded', function () {
    console.log("ADMIN: Página de gerenciamento carregada.");
    const btnAddPessoa = document.getElementById('btn-add-pessoa');
    const btnAddResponsavel = document.getElementById('btn-add-responsavel');
    const tabelaPessoas = document.getElementById('tabela-pessoas');
    const tabelaResponsaveis = document.getElementById('tabela-responsaveis');
    
    const pessoaNomeCompletoInput = document.getElementById('pessoa-nome-completo');
    const pessoaNomeGuerraInput = document.getElementById('pessoa-nome-guerra');
    const respNomeInput = document.getElementById('resp-nome');
    const respPostoInput = document.getElementById('resp-posto');
    const respFuncaoInput = document.getElementById('resp-funcao');

    console.log("ADMIN: Lendo dados do localStorage...");
    let bancoDePessoas = JSON.parse(localStorage.getItem('bancoDePessoas')) || [];
    console.log("ADMIN: Pessoas encontradas:", bancoDePessoas);
    let bancoDeResponsaveis = JSON.parse(localStorage.getItem('bancoDeResponsaveis')) || [];

    function renderizarPessoas() {
        tabelaPessoas.innerHTML = '';
        bancoDePessoas.forEach((pessoa, index) => {
            const linha = `<tr>
                <td>${pessoa.nomeCompleto}</td>
                <td>${pessoa.nomeGuerra}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removerPessoa(${index})">X</button></td>
            </tr>`;
            tabelaPessoas.innerHTML += linha;
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

    window.removerPessoa = function(index) {
        if (confirm('Tem certeza que deseja remover esta pessoa permanentemente?')) {
            bancoDePessoas.splice(index, 1);
            localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
            console.log("ADMIN: Pessoa removida. Dados salvos:", localStorage.getItem('bancoDePessoas'));
            renderizarPessoas();
        }
    }

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
            // MENSAGEM DE DIAGNÓSTICO IMPORTANTE
            console.log("ADMIN: Nova pessoa adicionada. Dados salvos:", localStorage.getItem('bancoDePessoas'));
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

    renderizarPessoas();
    renderizarResponsaveis();
});
