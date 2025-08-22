document.addEventListener('DOMContentLoaded', function () {
    console.log("INDEX: Página principal carregada.");
    const tabelaCorpo = document.getElementById('tabela-corpo');
    const selectResponsavel = document.getElementById('select-responsavel');
    const btnVisualizar = document.getElementById('btn-visualizar');
    const btnMarcarTodos = document.getElementById('btn-marcar-todos');
    const btnDesmarcarTodos = document.getElementById('btn-desmarcar-todos');

    // MENSAGENS DE DIAGNÓSTICO IMPORTANTES
    console.log("INDEX: Lendo dados do localStorage...");
    const dadosDoStorage = localStorage.getItem('bancoDePessoas');
    console.log("INDEX: String lida do localStorage:", dadosDoStorage);

    const bancoDePessoas = JSON.parse(dadosDoStorage) || [];
    console.log("INDEX: Array de pessoas após o parse:", bancoDePessoas);

    const bancoDeResponsaveis = JSON.parse(localStorage.getItem('bancoDeResponsaveis')) || [];

    function carregarPagina() {
        tabelaCorpo.innerHTML = '';
        console.log("INDEX: Total de pessoas a serem renderizadas:", bancoDePessoas.length);
        bancoDePessoas.forEach((pessoa, index) => {
            const linha = `
            <tr>
                <td class="text-center align-middle">
                    <input class="form-check-input checkbox-liberar" type="checkbox" value="${index}" checked>
                </td>
                <td class="align-middle">${pessoa.nomeCompleto}</td>
                <td class="align-middle">${pessoa.nomeGuerra}</td>
                <td class="text-center align-middle">
                    <input class="form-check-input checkbox-negrito" type="checkbox">
                </td>
            </tr>`;
            tabelaCorpo.innerHTML += linha;
        });

        selectResponsavel.innerHTML = '';
        if (bancoDeResponsaveis.length === 0) {
            selectResponsavel.innerHTML = '<option>Nenhum responsável cadastrado</option>';
        } else {
            bancoDeResponsaveis.forEach((resp, index) => {
                const option = `<option value="${index}">${resp.nome} - ${resp.posto}</option>`;
                selectResponsavel.innerHTML += option;
            });
        }
    }

    btnVisualizar.addEventListener('click', function () {
        const data = document.getElementById('dataLiberacao').value;
        const horario = document.getElementById('horarioLiberacao').value;
        const responsavelIndex = selectResponsavel.value;

        if (!data || !horario || responsavelIndex === '') {
            alert("Por favor, preencha a data, horário e selecione um responsável.");
            return;
        }

        const pessoasSelecionadas = [];
        const todasAsLinhas = tabelaCorpo.querySelectorAll('tr');
        
        todasAsLinhas.forEach((linha, index) => {
            const checkboxLiberar = linha.querySelector('.checkbox-liberar');
            if (checkboxLiberar && checkboxLiberar.checked) {
                const checkboxNegrito = linha.querySelector('.checkbox-negrito');
                const pessoa = bancoDePessoas[index];
                pessoasSelecionadas.push({
                    nomeCompleto: pessoa.nomeCompleto,
                    nomeGuerra: pessoa.nomeGuerra,
                    emNegrito: checkboxNegrito ? checkboxNegrito.checked : false
                });
            }
        });

        if (pessoasSelecionadas.length === 0) {
            alert("Nenhuma pessoa foi selecionada para a liberação.");
            return;
        }

        const dadosDaLista = {
            data: data,
            horario: horario,
            pessoas: pessoasSelecionadas,
            assinatura: bancoDeResponsaveis[responsavelIndex]
        };

        localStorage.setItem('dadosDaLista', JSON.stringify(dadosDaLista));
        window.open('lista.html', '_blank');
    });

    function setarTodosCheckboxes(marcado) {
        const checkboxes = tabelaCorpo.querySelectorAll('.checkbox-liberar');
        checkboxes.forEach(cb => cb.checked = marcado);
    }
    btnMarcarTodos.addEventListener('click', () => setarTodosCheckboxes(true));
    btnDesmarcarTodos.addEventListener('click', () => setarTodosCheckboxes(false));

    carregarPagina();
});
