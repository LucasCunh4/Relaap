window.onload = function() {
    const dadosSalvos = localStorage.getItem('dadosDaLista');

    // Parte 1: Lógica de Pré-visualização
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            
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

        } catch (e) {
            document.body.innerHTML = '<h1 class="text-center mt-5">Erro ao ler os dados da lista. Tente gerar novamente.</h1>';
        }
    } else {
        document.body.innerHTML = '<h1 class="text-center mt-5">Nenhum dado de lista encontrado. Gere uma lista na página principal primeiro.</h1>';
    }

    // Parte 2: Lógica do Botão PDF
    const btnImprimir = document.getElementById('btn-imprimir');
    btnImprimir.addEventListener('click', function() {
        // --- MUDANÇA NO NOME DO ARQUIVO ---
        // Pega o título original para usar no print
        const dados = JSON.parse(dadosSalvos);
        const horarioFormatado = dados.horario.replace(':', ''); // Transforma "12:00" em "1200"
        const partesData = dados.data.split('-'); // Transforma "2025-09-05" em ["2025", "09", "05"]
        const diaFormatado = partesData[2]; // "05"
        const mesFormatado = partesData[1]; // "09"
        const dataFormatadaParaNome = diaFormatado + mesFormatado; // "0509"
        
        // Define o novo título da página, que será usado como nome do arquivo PDF
        document.title = `N24.3-${horarioFormatado}-${dataFormatadaParaNome}`;
        // ------------------------------------

        window.print();
    });
};

function formatarData(dataString) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dataObj = new Date(dataString);
    const dia = dataObj.getUTCDate();
    const mes = meses[dataObj.getUTCMonth()];
    const ano = dataObj.getUTCFullYear();
    return `${dia} de ${mes} de ${ano}`;
}
