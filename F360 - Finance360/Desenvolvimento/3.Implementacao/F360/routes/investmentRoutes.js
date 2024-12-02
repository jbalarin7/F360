import express from 'express';
const router = express.Router();
import db from '../database/db.js';
import jwt from 'jsonwebtoken';

router.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, 'sua_chave_secreta'); // Substitua por sua chave secreta
        req.user = decoded; // Armazena os dados do usuário no request
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
});

router.use((req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    next();
});

router.get('/searchStocks', (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Nenhum termo de busca fornecido.' });
    }

    const query = `SELECT ticker, name FROM stocks WHERE ticker LIKE ? OR name LIKE ? LIMIT 10`;
    db.all(query, [`%${q}%`, `%${q}%`], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dados no banco:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar dados no banco.' });
        }

        res.json(rows);
    });
});

router.get('/investments', (req, res) => {
    const userId = req.session.user.id;
    const query = 'SELECT * FROM investments WHERE user_id = ?';
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar investimentos:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar investimentos.' });
        }
        res.json(rows || []); // Retorna um array vazio se não houver resultados
    });
});

export default router;