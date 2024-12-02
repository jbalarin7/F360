import fetch from 'node-fetch';
import db from '../database/db.js';

export async function fetchDividends(ticker) {
    const url = `https://brapi.dev/api/quote/${ticker}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BRAPI_API_KEY}` // Inclui a API Key no header
            }
        });

        const data = await response.json();

        // Verifica se 'results' existe e contém ao menos um item
        if (!data.results || data.results.length === 0) {
            console.log(`Nenhum resultado encontrado para ${ticker}`);
            return [];
        }

        const resultados = data.results[0];

        // Verifica se 'dividendsData' existe
        if (!resultados.dividendsData || resultados.dividendsData.length === 0) {
            console.log(`Nenhum dividendo disponível para ${ticker}`);
            return [];
        }

        // Filtra dividendos do mês atual
        const now = new Date();
        const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return resultados.dividendsData.filter((dividendo) =>
            dividendo.date.startsWith(mesAtual)
        );
    } catch (error) {
        console.error(`Erro ao buscar dividendos para ${ticker}:`, error.message);
        return [];
    }
}

export async function getTopDividends() {
    // Busca todos os tickers da tabela 'stocks'
    const tickers = await new Promise((resolve, reject) => {
        const query = 'SELECT ticker FROM stocks';
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar tickers:', err.message);
                reject(err);
            } else {
                resolve(rows.map(row => row.ticker));
            }
        });
    });

    const dividendosPorEmpresa = [];

    // Busca dividendos para cada ticker
    for (const ticker of tickers) {
        const dividendos = await fetchDividends(ticker);
        const total = dividendos.reduce((sum, dividendo) => sum + dividendo.value, 0);
        if (total > 0) {
            dividendosPorEmpresa.push({ ticker, total });
        }
    }

    // Ordena pelas empresas que mais pagaram dividendos
    dividendosPorEmpresa.sort((a, b) => b.total - a.total);

    // Retorna as 3 maiores pagadoras
    return dividendosPorEmpresa.slice(0, 3);
}