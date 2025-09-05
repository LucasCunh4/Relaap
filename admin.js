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

    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportFile = document.getElementById('input-import-file');

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

    new Sortable(tabelaPessoas, {
        animation: 150,
        onEnd: function (evt) {
            const itemMovido = bancoDePessoas.splice(evt.oldIndex, 1)[0];
            bancoDePessoas.splice(evt.newIndex, 0, itemMovido);
            localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
            renderizarPessoas(); 
        }
    });

    // --- LÓGICA DE EXPORTAR E IMPORTAR CORRIGIDA ---
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
        if (!file) {
            console.log("Nenhum arquivo selecionado.");
            return;
        }
        
        console.log("Arquivo selecionado:", file.name);
        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log("Arquivo lido com sucesso.");
            try {
                const dadosImportados = JSON.parse(e.target.result);
                console.log("Dados do arquivo (JSON parseado):", dadosImportados);

                if (dadosImportados && Array.isArray(dadosImportados.pessoas) && Array.isArray(dadosImportados.responsaveis)) {
                    if (confirm('Isso vai substituir todos os dados atuais. Deseja continuar?')) {
                        // --- MÉTODO MAIS SEGURO PARA ATUALIZAR OS DADOS ---
                        // Limpa os arrays existentes sem quebrar a referência
                        bancoDePessoas.length = 0;
                        bancoDeResponsaveis.length = 0;
                        // Adiciona os novos dados
                        dadosImportados.pessoas.forEach(p => bancoDePessoas.push(p));
                        dadosImportados.responsaveis.forEach(r => bancoDeResponsaveis.push(r));
                        
                        localStorage.setItem('bancoDePessoas', JSON.stringify(bancoDePessoas));
                        localStorage.setItem('bancoDeResponsaveis', JSON.stringify(bancoDeResponsaveis));
                        
                        renderizarPessoas();
                        renderizarResponsaveis();
                        
                        alert('Dados importados com sucesso!');
                    }
                } else {
                    alert('Arquivo inválido. O arquivo de backup deve conter as listas de "pessoas" e "responsaveis".');
                }
            } catch (error) {
                alert('Erro ao processar o arquivo. Verifique se é um arquivo de backup válido (.json).');
                console.error("Erro no JSON.parse:", error);
            }
        };

        reader.onerror = function() {
            alert('Ocorreu um erro ao tentar ler o arquivo.');
            console.error("Erro no FileReader:", reader.error);
        };
        
        reader.readAsText(file);
        inputImportFile.value = ''; 
    });

    // Renderização inicial
    renderizarPessoas();
    renderizarResponsaveis();
});
