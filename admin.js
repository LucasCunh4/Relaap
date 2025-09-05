document.addEventListener('DOMContentLoaded', function () {
    // ... (seleção de elementos como antes)
    const tabelaPessoas = document.getElementById('tabela-pessoas');
    const btnAddPessoa = document.getElementById('btn-add-pessoa');
    // ... (outros elementos)

    // --- NOVO ELEMENTO ---
    const btnToggleSort = document.getElementById('btn-toggle-sort');
    let sortableInstance = null; // Variável para guardar a instância do Sortable
    let isSortingEnabled = false; // Começa desabilitado

    // ... (outras variáveis e funções como antes) ...

    let bancoDePessoas = JSON.parse(localStorage.getItem('bancoDePessoas')) || [];
    let bancoDeResponsaveis = JSON.parse(localStorage.getItem('bancoDeResponsaveis')) || [];

    // --- CÓDIGO COMPLETO (substitua tudo no seu arquivo) ---

    const btnAddResponsavel = document.getElementById('btn-add-responsavel');
    const tabelaResponsaveis = document.getElementById('tabela-responsaveis');
    const pessoaNomeCompletoInput = document.getElementById('pessoa-nome-completo');
    const pessoaNomeGuerraInput = document.getElementById('pessoa-nome-guerra');
    const respNomeInput = document.getElementById('resp-nome');
    const respPostoInput = document.getElementById('resp-posto');
    const respFuncaoInput = document.getElementById('resp-funcao');
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportFile = document.getElementById('input-import-file');

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

    // Inicializa a função de arrastar, mas DESABILITADA por padrão
    sortableInstance = new Sortable(tabelaPessoas, {
        animation: 150,
        disabled: true, // Começa desabilitado
        onEnd: function (evt) {
            const itemMovido = bancoDePessoas.splice(evt.oldIndex, 1)[0];
            bancoDePessoas.splice(evt.newIndex, 0, itemMovido);
            localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
            renderizarPessoas(); 
        }
    });

    // --- NOVA LÓGICA DO BOTÃO DE HABILITAR/DESABILITAR ---
    btnToggleSort.addEventListener('click', () => {
        isSortingEnabled = !isSortingEnabled; // Inverte o estado (true/false)
        sortableInstance.option('disabled', !isSortingEnabled); // Aplica o novo estado

        if (isSortingEnabled) {
            btnToggleSort.textContent = 'Bloquear Ordenação';
            btnToggleSort.classList.remove('btn-outline-secondary');
            btnToggleSort.classList.add('btn-success');
            tabelaPessoas.style.cursor = 'grab';
        } else {
            btnToggleSort.textContent = 'Habilitar Ordenação';
            btnToggleSort.classList.remove('btn-success');
            btnToggleSort.classList.add('btn-outline-secondary');
            tabelaPessoas.style.cursor = '';
        }
    });

    // Lógica de Exportar e Importar (continua a mesma)
    btnExportar.addEventListener('click', () => {
        const dadosParaSalvar = {
            pessoas: bancoDePessoas,
            responsaveis: bancoDeResponsaveis
        };
        const dadosString = JSON.stringify(dadosParaSalvar, null, 2);
        const blob = new Blob([dadosString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup_dados.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    btnImportar.addEventListener('click', () => {
        inputImportFile.click();
    });

    inputImportFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) { return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dadosImportados = JSON.parse(e.target.result);
                if (dadosImportados && Array.isArray(dadosImportados.pessoas) && Array.isArray(dadosImportados.responsaveis)) {
                    if (confirm('Isso vai substituir todos os dados atuais. Deseja continuar?')) {
                        bancoDePessoas.length = 0;
                        bancoDeResponsaveis.length = 0;
                        dadosImportados.pessoas.forEach(p => bancoDePessoas.push(p));
                        dadosImportados.responsaveis.forEach(r => bancoDeResponsaveis.push(r));
                        localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
                        localStorage.setItem('bancoDeResponsaveis', JSON.stringify(bancoDeResponsaveis));
                        renderizarPessoas();
                        renderizarResponsaveis();
                        alert('Dados importados com sucesso!');
                    }
                } else {
                    alert('Arquivo inválido.');
                }
            } catch (error) {
                alert('Erro ao ler o arquivo.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        inputImportFile.value = ''; 
    });

    renderizarPessoas();
    renderizarResponsaveis();
});
