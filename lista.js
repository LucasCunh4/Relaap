window.onload = function() {
    const dadosSalvos = localStorage.getItem('dadosDaLista');

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            
            // --- MUDANÇA PRINCIPAL ---
            const cabecalhoTabela = document.getElementById('cabecalho-tabela');
            // 1. Corrige o formato da hora para HH:MMh
            const textoCabecalho = `Relação dos alunos autorizados a licenciar às ${dados.horario}h do dia ${formatarData(dados.data)}`;
            
            // 2. Cria o cabeçalho como linhas da tabela
            cabecalhoTabela.innerHTML = `
                <tr>
                    <th colspan="2" class="cabecalho-principal">${textoCabecalho}</th>
                </tr>
                <tr>
                    <th>NOME COMPLETO</th>
                    <th>NOME DE GUERRA</th>
                </tr>
            `;
            // -------------------------

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

    const btnImprimir = document.getElementById('btn-imprimir');
    btnImprimir.addEventListener('click', function() {
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
