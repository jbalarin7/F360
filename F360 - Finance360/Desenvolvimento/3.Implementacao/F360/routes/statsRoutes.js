import express from 'express';
import db from '../database/db.js';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/stats', async (req, res) => {
    const { ticker, days = 10 } = req.query; // Adiciona suporte ao parâmetro "days" com valor padrão 10

    if (!ticker) {
        return res.status(400).json({ error: 'Ticker não fornecido.' });
    }

    // Valida o parâmetro `days`
    const validDays = Math.min(Math.max(parseInt(days, 10), 1), 30); // Limita entre 1 e 30 dias

    try {
        console.log(`Buscando registros dos últimos ${validDays} dias para o ticker ${ticker.toUpperCase()} no banco de dados...`);

        // Calcula a data inicial com base no número de dias
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - validDays);

        const formattedStartDate = startDate.toISOString().split('T')[0];

        // Consulta para buscar os registros do período solicitado
        const querySelect = `
            SELECT * 
            FROM stock_prices 
            WHERE UPPER(symbol) = ? 
              AND date >= ? 
            ORDER BY date ASC
        `;

        db.all(querySelect, [ticker.toUpperCase(), formattedStartDate], async (err, rows) => {
            if (err) {
                console.error('Erro ao acessar o banco:', err.message);
                return res.status(500).json({ error: 'Erro ao acessar o banco.' });
            }

            if (rows && rows.length > 0) {
                console.log(`Dados encontrados no banco para o ticker ${ticker.toUpperCase()}.`);
                return res.json(rows); // Retorna os dados encontrados no banco
            }

            console.log(`Nenhum dado encontrado para o ticker ${ticker.toUpperCase()} no banco. Requisitando à API da Brapi...`);
            await requisitarDadosAPI(ticker, validDays, res);
        });
    } catch (error) {
        console.error('Erro geral:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

async function requisitarDadosAPI(ticker, days, res) {
    try {
        const response = await fetch(`https://brapi.dev/api/quote/${ticker}`, {
            headers: {
                'Authorization': `Bearer ${process.env.BRAPI_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na API da Brapi: ${response.statusText}`);
        }

        const data = await response.json();
        const stock = data.results[0];

        const {
            symbol,
            regularMarketDayHigh: high_price,
            regularMarketDayLow: low_price,
            regularMarketOpen: open_price,
            regularMarketPrice: close_price,
            regularMarketTime,
        } = stock;

        const date = regularMarketTime.split('T')[0]; // Formata a data para YYYY-MM-DD

        console.log(`Salvando dados no banco para o ticker ${symbol} na data ${date}...`);

        const queryInsert = `
            INSERT OR IGNORE INTO stock_prices (symbol, date, open_price, high_price, low_price, close_price)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(queryInsert, [symbol.toUpperCase(), date, open_price, high_price, low_price, close_price], (err) => {
            if (err) {
                console.error('Erro ao salvar no banco:', err.message);
                return res.status(500).json({ error: 'Erro ao salvar no banco.' });
            }

            console.log('Dados salvos no banco com sucesso.');

            // Busca novamente os últimos `days` dias no banco
            const startDate = new Date();
            startDate.setDate(new Date().getDate() - days);
            const formattedStartDate = startDate.toISOString().split('T')[0];

            const querySelect = `
                SELECT * 
                FROM stock_prices 
                WHERE UPPER(symbol) = ? 
                  AND date >= ? 
                ORDER BY date ASC
            `;

            db.all(querySelect, [symbol.toUpperCase(), formattedStartDate], (err, rows) => {
                if (err) {
                    console.error('Erro ao acessar o banco após salvar os dados:', err.message);
                    return res.status(500).json({ error: 'Erro ao acessar o banco após salvar os dados.' });
                }

                res.json(rows); // Retorna os dados atualizados
            });
        });
    } catch (apiError) {
        console.error('Erro ao buscar dados da API da Brapi:', apiError.message);
        return res.status(500).json({ error: 'Erro ao buscar dados da API.' });
    }
}

export default router;
