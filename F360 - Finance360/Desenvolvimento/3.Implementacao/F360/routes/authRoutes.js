import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import dotenv from 'dotenv'; // Importando dotenv

dotenv.config(); // Carregar as variáveis do .env

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
    }

    try {
        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir no banco de dados
        const queryInsert = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
        db.run(queryInsert, [email, hashedPassword], function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ error: 'Email já registrado!' });
                }
                return res.status(500).json({ error: 'Erro ao registrar usuário.' });
            }

            res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, password, keepLogged } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
    }

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [email], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
            if (!user) return res.status(400).json({ error: 'Usuário não encontrado!' });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(400).json({ error: 'Senha incorreta!' });

            // Gerar o token de autenticação
            const token = jwt.sign(
                { id: user.id, username: user.email }, // Alterado para usar o email
                process.env.JWT_SECRET || 'default_secret', // Usando o segredo do .env
                {
                    expiresIn: keepLogged ? '7d' : '1h', // Expira em 7 dias ou 1 hora
                }
            );

            res.status(200).json({ message: 'Login bem-sucedido!', token });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Rota de Validação do Token
router.get('/validate', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        // Verificar o token usando o segredo do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        res.status(200).json({ message: 'Token válido!', user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido.' });
    }
});

export default router;
