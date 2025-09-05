// Função para formatar a data para exibição no cabeçalho
function formatarData(dataString) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dataObj = new Date(dataString);
    const dia = dataObj.getUTCDate();
    const mes = meses[dataObj.getUTCMonth()];
    const ano = dataObj.getUTCFullYear();
    return `${dia} de ${mes} de ${ano}`;
}

// Evento que roda quando a página termina de carregar
window.onload = function() {
    const dadosSalvos = localStorage.getItem('dadosDaLista');

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            document.getElementById('cabecalho-lista').innerHTML = `<h5>Relação dos alunos autorizados a licenciar às ${dados.horario}h do dia ${formatarData(dados.data)}</h5>`;

            const tabelaCorpo = document.getElementById('corpo-tabela-lista');
            tabelaCorpo.innerHTML = '';
            // AQUI ELE ADICIONA AS CLASSES NECESSÁRIAS
            dados.pessoas.forEach(pessoa => {
                const classeNegrito = pessoa.emNegrito ? 'class="texto-negrito"' : '';
                tabelaCorpo.innerHTML += `
                    <tr ${classeNegrito}>
                        <td class="coluna-nome-completo">${pessoa.nomeCompleto}</td>
                        <td class="coluna-nome-guerra">${pessoa.nomeGuerra}</td>
                    </tr>`;
            });

            document.getElementById('assinatura-lista').innerHTML = `<hr><p class="nome-responsavel">${dados.assinatura.nome}</p><p class="posto-responsavel">${dados.assinatura.posto}</p><p class="funcao-responsavel">${dados.assinatura.funcao}</p>`;

            const btnImprimir = document.getElementById('btn-imprimir');
            if (btnImprimir) {
                btnImprimir.addEventListener('click', function() {
                    const horarioFormatado = dados.horario.replace(':', '');
                    const partesData = dados.data.split('-');
                    const diaFormatado = partesData[2];
                    const mesFormatado = partesData[1];
                    const dataFormatadaParaNome = diaFormatado + mesFormatado;
                    
                    // Usando o caractere especial para o nome do arquivo funcionar com ponto
                    const nomeFinalDoArquivo = `N24⋅3-${horarioFormatado}-${dataFormatadaParaNome}`;
                    
                    document.title = nomeFinalDoArquivo;
                    window.print();
                });
            }

        } catch (e) {
            document.body.innerHTML = '<h1 class="text-center mt-5">Erro ao ler os dados da lista. Tente gerar novamente.</h1>';
        }
    } else {
        document.body.innerHTML = '<h1 class="text-center mt-5">Nenhum dado de lista encontrado. Gere uma lista na página principal primeiro.</h1>';
    }
};
