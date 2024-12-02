import express from 'express';
import db from '../database/db.js';
import { getTopDividends } from '../routes/dividends.js';

const router = express.Router();

router.get('/dividends/month', (req, res) => {
    const query = `
        SELECT empresa, SUM(valor) AS total_dividendos
        FROM dividends
        WHERE strftime('%Y-%m', data) = strftime('%Y-%m', 'now')
        GROUP BY empresa
        ORDER BY total_dividendos DESC
        LIMIT 10;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dividendos do mês:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar dividendos.' });
        }
        console.log('Dividendos retornados:', rows); // Debug no servidor
        res.status(200).json(rows);
    });
});

router.get('/dividends/top', async (req, res) => {
    try {
        const topDividends = await getTopDividends();
        res.status(200).json(topDividends);
    } catch (error) {
        console.error('Erro ao obter dividendos:', error.message);
        res.status(500).json({ error: 'Erro ao obter dividendos.' });
    }
});

export default router;
