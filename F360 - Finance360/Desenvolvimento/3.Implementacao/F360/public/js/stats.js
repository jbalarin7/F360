let mainTickerData = [];
let compareTickerData = [];
let mainTickerName = "";
let compareTickerName = "";

// Adiciona o evento de clique no botão de comparação
document.getElementById('compareButton').addEventListener('click', () => {
    const compareTicker = document.getElementById('compareTicker').value.toUpperCase();
    if (compareTicker) {
        fetchStockData(compareTicker, 10, true);
    } else {
        alert("Por favor, insira um ticker válido.");
    }
});

// Função principal para buscar dados de ações
async function fetchStockData(ticker, days = 10, compare = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const mainTicker = urlParams.get('ticker');
    const tickerToFetch = compare ? ticker : mainTicker;

    try {
        const response = await fetch(`/api/stats?ticker=${tickerToFetch}&days=${days}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        const data = await response.json();

        // Atualiza o nome do ativo principal e do comparado
        if (compare) {
            compareTickerData = data;
            compareTickerName = data[0]?.symbol || '';
            updateAssetNames();
            renderComparisonChart();
        } else {
            mainTickerData = data;
            mainTickerName = data[0]?.symbol || '';
            updateAssetNames();
            renderChart();
        }
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

function updateAssetNames() {
    // Atualizar o nome do Ativo Principal
    document.getElementById('asset-name').innerText = `Ativo Principal: ${mainTickerName}`;
    
    // Atualizar o nome do Ativo Comparado
    document.getElementById('compare-asset-name').innerText = `Ativo Comparado: ${compareTickerName || '--'}`;
}

// Função para renderizar o gráfico do primeiro ativo
function renderChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');

    // Verificar se o gráfico já existe e destruí-lo antes de criar um novo
    if (window.stockChart instanceof Chart) {
        window.stockChart.destroy();
    }

    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mainTickerData.map(item => item.date),
            datasets: [{
                label: `${mainTickerName} (Ativo Principal)`,
                data: mainTickerData.map(item => item.close_price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const item = mainTickerData[tooltipItem.dataIndex];
                            return [
                                `Abertura: R$ ${item.open_price?.toFixed(2) || 'N/A'}`,
                                `Mínimo: R$ ${item.low_price?.toFixed(2) || 'N/A'}`,
                                `Máximo: R$ ${item.high_price?.toFixed(2) || 'N/A'}`,
                                `Fechamento: R$ ${item.close_price?.toFixed(2) || 'N/A'}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function (value) {
                            return `R$ ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Função para renderizar o gráfico de comparação
function renderComparisonChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');

    // Verificar se o gráfico já existe e destruí-lo antes de criar um novo
    if (window.stockChart instanceof Chart) {
        window.stockChart.destroy();
    }

    // Mesclar os dados de ambos os ativos, ordenando por data
    const combinedData = [...mainTickerData, ...compareTickerData];
    
    // Ordenar os dados pela data em ordem crescente
    const sortedData = combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extrair as datas únicas, já ordenadas
    const uniqueDates = Array.from(new Set(sortedData.map(item => item.date)));

    // Para cada data única, buscamos os dados mais próximos (ou iguais) de ambos os ativos
    const mainDataForChart = uniqueDates.map(date => {
        return mainTickerData.find(item => item.date === date) || { close_price: null };
    });

    const compareDataForChart = uniqueDates.map(date => {
        return compareTickerData.find(item => item.date === date) || { close_price: null };
    });

    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: uniqueDates,
            datasets: [
                {
                    label: `${mainTickerName}`,
                    data: mainDataForChart.map(item => item.close_price),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                    label: `${compareTickerName}`,
                    data: compareDataForChart.map(item => item.close_price),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const datasetIndex = tooltipItem.datasetIndex;
                            const date = uniqueDates[tooltipItem.dataIndex];

                            // Dependendo do dataset (ativo), mostra os dados corretos
                            let item;
                            if (datasetIndex === 0) {
                                item = mainDataForChart.find(i => i.date === date);
                            } else {
                                item = compareDataForChart.find(i => i.date === date);
                            }

                            // Retorna os dados do ativo correto
                            return [
                                `${datasetIndex === 0 ? mainTickerName : compareTickerName} - Abertura: R$ ${item.open_price?.toFixed(2) || 'N/A'}`,
                                `${datasetIndex === 0 ? mainTickerName : compareTickerName} - Mínimo: R$ ${item.low_price?.toFixed(2) || 'N/A'}`,
                                `${datasetIndex === 0 ? mainTickerName : compareTickerName} - Máximo: R$ ${item.high_price?.toFixed(2) || 'N/A'}`,
                                `${datasetIndex === 0 ? mainTickerName : compareTickerName} - Fechamento: R$ ${item.close_price?.toFixed(2) || 'N/A'}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function (value) {
                            return `R$ ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}


// Adiciona os listeners aos botões
function addButtonListeners() {
    document.getElementById('btn7Days').addEventListener('click', () => fetchStockData(null, 7));
    document.getElementById('btn15Days').addEventListener('click', () => fetchStockData(null, 15));
    document.getElementById('btn30Days').addEventListener('click', () => fetchStockData(null, 30));
}

// Atualiza o gráfico ao clicar nos botões
function updateChart(days) {
    fetchStockData(days);
}

// Chama a função para buscar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();

    addButtonListeners();
});
