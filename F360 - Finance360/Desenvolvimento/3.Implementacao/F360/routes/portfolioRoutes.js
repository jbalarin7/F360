import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Middleware para autenticação (verifica se o usuário está logado)
router.use((req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    next();
});

// Rota para listar os investimentos do usuário
router.get('/investments', (req, res) => {
    const userId = req.session.user.id;
    const query = 'SELECT * FROM investments WHERE user_id = ?';
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar investimentos:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar investimentos.' });
        }
        res.json(rows);
    });
});

// Rota para adicionar um investimento
router.post('/investments', (req, res) => {
    const { ticker, value, quantity } = req.body;
    const userId = req.session.user.id;
    const query = `
        INSERT INTO investments (user_id, ticker, value, quantity)
        VALUES (?, ?, ?, ?)
    `;
    db.run(query, [userId, ticker, value, quantity], function (err) {
        if (err) {
            console.error('Erro ao adicionar investimento:', err.message);
            return res.status(500).json({ error: 'Erro ao adicionar investimento.' });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Rota para atualizar um investimento
router.put('/investments/:id', (req, res) => {
    const { ticker, value, quantity } = req.body;
    const investmentId = req.params.id;
    const userId = req.session.user.id;
    const query = `
        UPDATE investments
        SET ticker = ?, value = ?, quantity = ?
        WHERE id = ? AND user_id = ?
    `;
    db.run(query, [ticker, value, quantity, investmentId, userId], (err) => {
        if (err) {
            console.error('Erro ao atualizar investimento:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar investimento.' });
        }
        res.json({ message: 'Investimento atualizado com sucesso!' });
    });
});

// Rota para deletar um investimento
router.delete('/investments/:id', (req, res) => {
    const investmentId = req.params.id;
    const userId = req.session.user.id;
    const query = `
        DELETE FROM investments
        WHERE id = ? AND user_id = ?
    `;
    db.run(query, [investmentId, userId], (err) => {
        if (err) {
            console.error('Erro ao deletar investimento:', err.message);
            return res.status(500).json({ error: 'Erro ao deletar investimento.' });
        }
        res.json({ message: 'Investimento deletado com sucesso!' });
    });
});

export default router;
