const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get('ticker');

const actionTitle = document.getElementById('action-title');
const actionDetails = document.getElementById('action-details');

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function fetchStockInfo(ticker) {
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da ação');

        const data = await response.json();
        exibirResumo(data);
        carregarDadosHistoricos(ticker);
    } catch (error) {
        console.error('Erro ao buscar dados da ação:', error.message);
        document.getElementById('action-details').innerHTML =
            '<p>Erro ao carregar informações da ação.</p>';
    }
}

function exibirResumo(stockInfo) {
    const actionTitle = document.getElementById('action-title');
    const actionDetails = document.getElementById('action-details');
    const actionLogo = document.getElementById('action-logo');

    const changePercent = typeof stockInfo.regular_market_change_percent === 'number' 
    ? stockInfo.regular_market_change_percent.toFixed(2) + "%" 
    : "N/A";

    actionTitle.textContent = `${stockInfo.symbol} - ${stockInfo.long_name || 'Resumo'}`;
    actionDetails.innerHTML = `
        <h3>Desempenho no Dia</h3>
        <p> </p>
        <p><strong>Data:</strong> ${new Date(stockInfo.regular_market_time).toLocaleDateString('pt-BR') || 'N/A'}</p>
        <p><strong>Preço de Abertura:</strong> R$ ${stockInfo.regular_market_open || 'N/A'}</p>
        <p><strong>Preço de Fechamento:</strong> R$ ${stockInfo.regular_market_previous_close || 'N/A'}</p>
        <p><strong>Variação Percentual:</strong> ${changePercent}</p>
        <p><strong>Volume:</strong> ${stockInfo.regular_market_volume || 'N/A'}</p>
        <p><strong>Earnings per share:</strong> ${stockInfo.earnings_per_share || 'N/A'}</p>
    `;

    // Atualiza o logo da empresa
    if (stockInfo.logourl) {
        actionLogo.src = stockInfo.logourl;
    } else {
        actionLogo.src = "";
        actionLogo.alt = "Logo não disponível";
    }
}

async function carregarDadosHistoricos(ticker) {
    try {
        const response = await fetch(`/api/stock/stock-history/${ticker}`);
        if (!response.ok) throw new Error('Erro ao carregar dados históricos');

        const data = await response.json();
        console.log(data)

        const labels = data.map((item) => new Date(item.regular_market_time).toLocaleDateString('pt-BR') ); // Datas
        const closePrices = data.map((item) => item.regular_market_previous_close);

        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: 'Preço de Fechamento',
                    data: closePrices.reverse(),
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Preço (R$)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (ticker) {
        fetchStockInfo(ticker);
    } else {
        actionDetails.innerHTML = '<p>Erro: Nenhum ticker especificado.</p>';
    }
});
