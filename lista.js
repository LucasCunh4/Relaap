window.onload = function() {
    const dadosSalvos = localStorage.getItem('dadosDaLista');

    if (dadosSalvos) {
        try {
            // Parse os dados UMA VEZ e guarde em uma variável
            const dados = JSON.parse(dadosSalvos);

            // --- INÍCIO DA PARTE 1: LÓGICA DE PRÉ-VISUALIZAÇÃO ---
            if (dados.textoEmNegrito) {
                document.getElementById('conteudo-para-impressao').dataset.textoNegrito = 'true';
            }

            document.getElementById('cabecalho-lista').innerHTML = `<h5>Relação dos alunos autorizados a licenciar às ${dados.horario}h do dia ${formatarData(dados.data)}</h5>`;

            const tabelaCorpo = document.getElementById('corpo-tabela-lista');
            tabelaCorpo.innerHTML = '';
            dados.pessoas.forEach(pessoa => {
                const classeNegrito = pessoa.emNegrito ? 'class="texto-negrito"' : '';
                tabelaCorpo.innerHTML += `
                    <tr ${classeNegrito}>
                        <td>${pessoa.nomeCompleto}</td>
                        <td>${pessoa.nomeGuerra}</td>
                    </tr>`;
            });

            document.getElementById('assinatura-lista').innerHTML = `<hr><p class="nome-responsavel">${dados.assinatura.nome}</p><p class="posto-responsavel">${dados.assinatura.posto}</p><p class="funcao-responsavel">${dados.assinatura.funcao}</p>`;
            // --- FIM DA PARTE 1 ---


            // --- INÍCIO DA PARTE 2: LÓGICA DO BOTÃO PDF (AGORA DENTRO DO IF) ---
            const btnImprimir = document.getElementById('btn-imprimir');
            if (btnImprimir) { // Boa prática: verificar se o botão existe
                btnImprimir.addEventListener('click', function() {
                    // Não precisa fazer o parse de novo, já temos a variável 'dados'
                    const horarioFormatado = dados.horario.replace(':', '');
                    const partesData = dados.data.split('-');
                    const diaFormatado = partesData[2];
                    const mesFormatado = partesData[1];
                    const dataFormatadaParaNome = diaFormatado + mesFormatado;

                    document.title = `N24.3-${horarioFormatado}-${dataFormatadaParaNome}`;

                    window.print();
                });
            }
            // --- FIM DA PARTE 2 ---

        } catch (e) {
            console.error("Erro ao processar dados da lista:", e); // Mostra o erro no console para depuração
            document.body.innerHTML = '<h1 class="text-center mt-5">Erro ao ler os dados da lista. Tente gerar novamente.</h1>';
        }
    } else {
        document.body.innerHTML = '<h1 class="text-center mt-5">Nenhum dado de lista encontrado. Gere uma lista na página principal primeiro.</h1>';
    }
};

// A função formatarData permanece igual
function formatarData(dataString) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dataObj = new Date(dataString);
    const dia = dataObj.getUTCDate();
    const mes = meses[dataObj.getUTCMonth()];
    const ano = dataObj.getUTCFullYear();
    return `${dia} de ${mes} de ${ano}`;
}
