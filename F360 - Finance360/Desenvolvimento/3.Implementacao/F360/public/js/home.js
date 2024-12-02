const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.createElement('div'); // Contêiner para sugestões
suggestionsContainer.className = 'suggestions';
document.querySelector('.search-bar').appendChild(suggestionsContainer);
import fetch from 'node-fetch';

// Função para buscar sugestões
async function buscarSugestoes(query) {
    try {
        const response = await fetch(`/searchStocks?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Erro ao buscar ações');
        const data = await response.json();
        mostrarSugestoes(data);
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao carregar sugestões');
    }
}

// Função para mostrar sugestões
function mostrarSugestoes(data) {
    if (data.length > 0) {
        suggestionsContainer.innerHTML = data
            .map(stock => `<div class="suggestion-item" data-ticker="${stock.ticker}">${stock.ticker} - ${stock.name}</div>`)
            .join('');
        suggestionsContainer.style.display = 'block';

        // Adicionar eventos de clique nas sugestões
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function () {
                const ticker = this.getAttribute('data-ticker'); // Obtém o ticker diretamente
                searchInput.value = ticker; // Preenche o campo com o ticker
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                window.location.href = `/stats.html?ticker=${encodeURIComponent(ticker)}`; // Redireciona com o ticker
            });
        });
    } else {
        suggestionsContainer.innerHTML = '<div class="no-results">Nenhuma ação encontrada</div>';
        suggestionsContainer.style.display = 'block';
    }
}

// Evento de digitação no campo de busca
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim();
    if (!searchTerm) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        return;
    }
    buscarSugestoes(searchTerm);
});

// Evento de pressionar "Enter"
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchInput.value.trim() !== '') {
        const ticker = searchInput.value.trim();
        window.location.href = `/stats.html?ticker=${encodeURIComponent(ticker)}`;
    }
});
// Captura o contêiner onde os dividendos serão exibidos
const dividendosContainer = document.querySelector('#dividendosContainer');

fetch('/api/dividends/month')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dividendos');
        }
        return response.json();
    })
    .then((data) => {
        const dividendosContainer = document.querySelector('#dividendosContainer');
        dividendosContainer.innerHTML = ''; // Limpa o conteúdo atual

        if (data.length === 0) {
            dividendosContainer.innerHTML = '<p>Sem dividendos neste mês.</p>';
            return;
        }

        // Renderiza os dividendos
        const dividendosHTML = data
            .map(
                (dividendo) => `
                <div class="dividendo-item">
                    <!-- Link para a página stats.html com o ticker -->
                    <a href="/stats.html?ticker=${encodeURIComponent(dividendo.empresa)}" class="empresa-link">
                        <strong>${dividendo.empresa}</strong>
                    </a>
                    <p>Total: R$ ${dividendo.total_dividendos.toFixed(2)}</p>
                </div>
            `
            )
            .join('');

        dividendosContainer.innerHTML = dividendosHTML;
    })
    .catch((error) => {
        console.error('Erro:', error);
        const dividendosContainer = document.querySelector('#dividendosContainer');
        dividendosContainer.innerHTML = '<p>Erro ao carregar dividendos.</p>';
    });

    fetch('/api/dividends/top')
    .then((response) => response.json())
    .then((data) => {
        const container = document.querySelector('#dividendosContainer');
        container.innerHTML = data
            .map(
                (dividendo) => `
                <div class="dividendo-item">
                    <strong>${dividendo.ticker}</strong>
                    <p>Total: R$ ${dividendo.total.toFixed(2)}</p>
                </div>
            `
            )
            .join('');
    })
    .catch((error) => console.error('Erro ao carregar dividendos:', error));
