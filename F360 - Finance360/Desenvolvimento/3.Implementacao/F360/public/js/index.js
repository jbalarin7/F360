// Configuração de constantes
const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.querySelector('.suggestions');
const maioresValores = document.getElementById('maiores-valores');
const earnings = document.getElementById('earnings');
const receitas = document.getElementById('receitas');
const recentesContainer = document.getElementById('recentes-container');

// --- EVENTOS INICIAIS --- //
// Atualiza o link do botão "Iniciar Sessão" dinamicamente
document.addEventListener("DOMContentLoaded", () => {
    carregarPesquisasRecentes();
    carregarRankings();
});

// --- FUNÇÕES DE SUGESTÕES --- //
async function buscarSugestoes(query) {
    try {
        const response = await fetch(`/api/stock/stocks?key=${encodeURIComponent(query)}`);
        if (!response.ok) {
            mostrarErro(response.status === 500 ? 'Erro ao carregar sugestões' : 'Ação não encontrada');
        } else {
            const data = await response.json();
            mostrarSugestoes(data);
        }
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
    }
}

function mostrarSugestoes(data) {
    if (data.length > 0) {
        suggestionsContainer.innerHTML = data
            .map(stock => `<div class="suggestion-item" data-ticker="${stock.ticker}">${stock.ticker} - ${stock.name}</div>`)
            .join('');
        suggestionsContainer.style.display = 'block';

        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function () {
                const ticker = this.getAttribute('data-ticker');
                searchInput.value = ticker;
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                salvarPesquisaRecente(ticker);
                redirecionarParaEstatisticas(ticker);
            });
        });
    } else {
        mostrarErro('Nenhuma ação encontrada');
    }
}

function mostrarErro(mensagem) {
    suggestionsContainer.innerHTML = `<div class="error-message">${mensagem}</div>`;
    suggestionsContainer.style.display = 'block';
    suggestionsContainer.style.color = 'red';
}

// --- MANIPULAÇÃO DE PESQUISAS --- //
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim();
    if (!searchTerm) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        return;
    }
    buscarSugestoes(searchTerm);
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchInput.value.trim() !== '') {
        const ticker = searchInput.value.trim();
        salvarPesquisaRecente(ticker);
        redirecionarParaEstatisticas(ticker);
    }
});

// --- GERENCIAMENTO DE PESQUISAS RECENTES --- //
function salvarPesquisaRecente(ticker) {
    let recentes = JSON.parse(localStorage.getItem('recentes')) || [];
    if (!recentes.includes(ticker)) {
        recentes.unshift(ticker);
        if (recentes.length > 5) recentes.pop();
        localStorage.setItem('recentes', JSON.stringify(recentes));
    }
}

function carregarPesquisasRecentes() {
    const recentes = JSON.parse(localStorage.getItem('recentes')) || [];
    if (recentes.length === 0) {
        recentesContainer.innerHTML = '<p>Nenhuma pesquisa recente.</p>';
    } else {
        recentesContainer.innerHTML = recentes
            .map(ticker => `<div class="recent-item" onclick="redirecionarParaEstatisticas('${ticker}')">${ticker}</div>`)
            .join('');
    }
}

// --- FUNÇÕES DE RANKINGS --- //
async function carregarRankings() {
    try {
        await Promise.all([
            carregarRanking('/api/stock/ranking?order=true', maioresValores, '📈 Maiores Altas', 'regular_market_change_percent'),
            carregarRanking('/api/stock/ranking?order=false', earnings, '💰 Maiores Baixas', 'regular_market_change_percent'),
            carregarRanking('/api/stock/mosttraded', receitas, '📊 Mais Compradas', 'regular_market_volume')
        ]);
    } catch (error) {
        console.error('Erro ao carregar os rankings:', error);
    }
}

async function carregarRanking(endpoint, container, titulo, chave) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        container.innerHTML = `
            <h3>${titulo}</h3>
            <ul>
                ${data.map(item => `
                    <li>
                        <a href="/stats.html?ticker=${encodeURIComponent(item.symbol)}" class="ranking-link">
                            ${item.symbol}: ${chave == 'regular_market_change_percent' ? item[chave].toFixed(2) + '%' : item[chave].toFixed(2)}${item.regular_market_price ? ' | R$' + item.regular_market_price.toFixed(2) : ''}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        container.innerHTML = `<p>Erro ao carregar ${titulo.toLowerCase()}</p>`;
    }
}

// --- FUNÇÕES AUXILIARES --- //
function redirecionarParaEstatisticas(ticker) {
    window.location.href = `/stats.html?ticker=${encodeURIComponent(ticker)}`;
}
