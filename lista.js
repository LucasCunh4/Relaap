// Função para formatar a data para exibição no cabeçalho (ex: 5 de Setembro de 2025)
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

    // 1. Verifica se existem dados salvos no localStorage
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            // 2. Monta a pré-visualização da lista na página
            // (Usando o ID corrigido 'cabecalho-lista'. Se você usou 'cabecalho-tabela', ajuste aqui)
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

            // 3. Configura o botão de imprimir
            const btnImprimir = document.getElementById('btn-imprimir');
            if (btnImprimir) {
                btnImprimir.addEventListener('click', function() {
                    
                    // --- LÓGICA PARA O NOME DO ARQUIVO ---
                    // Converte o horário "12:00" para "1200"
                    const horarioFormatado = dados.horario.replace(':', '');

                    // Converte a data "2025-09-05" para "0509"
                    const partesData = dados.data.split('-'); // ["2025", "09", "05"]
                    const diaFormatado = partesData[2]; // "05"
                    const mesFormatado = partesData[1]; // "09"
                    const dataFormatadaParaNome = diaFormatado + mesFormatado; // "0509"

                    // Define o título da página, que será usado como nome do arquivo PDF
                    document.title = `N24.3-${horarioFormatado}-${dataFormatadaParaNome}.pdf`;

                    // Aciona a janela de impressão
                    window.print();
                });
            }

        } catch (e) {
            // Se houver erro na leitura dos dados, exibe mensagem de erro
            document.body.innerHTML = '<h1 class="text-center mt-5">Erro ao ler os dados da lista. Tente gerar novamente.</h1>';
        }
    } else {
        // Se não encontrar dados, exibe mensagem de aviso
        document.body.innerHTML = '<h1 class="text-center mt-5">Nenhum dado de lista encontrado. Gere uma lista na página principal primeiro.</h1>';
    }
};
