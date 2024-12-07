import { findUserByEmail } from '../models/userModel.js'; // Importa o modelo de usuário
import bcrypt from 'bcrypt'; // Para comparar a senha (uso de hashing)

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({ error: 'Usuário e senha são necessários' });
    }
    try {
        // Verifica se o usuário existe
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Erro ao efetuar login' });
    }
    // Verifica a senha usando bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
        return res.status(500).json({ error: 'Erro na comparação da senha' });
        }
        if (!result) {
        return res.status(401).json({ error: 'Senha incorreta' });
        }
        req.session.userId = user.id;
        console.log('ID do usuário armazenado na sessão:', user.id);
        return res.status(200).json({ message: 'Login bem-sucedido' });
    });
};

export const registerUser = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, senha e nome do usuário são necessários' });
    }

    try {
        const user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({ error: 'E-mail já registrado.' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }

    try {
        const userCreated = await createUser(email, password, username);
        if (userCreated) {
            return res.status(201).json({ error: 'Usuário registrado com sucesso!' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout.' });
        }
        res.clearCookie('connect.sid');  // Limpa o cookie de sessão
        res.status(200).json({ message: 'Logout realizado com sucesso.' });
    });
};

