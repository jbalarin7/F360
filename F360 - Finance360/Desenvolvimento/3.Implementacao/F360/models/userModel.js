import getDb from '../database/db.js'; // Banco de dados

// Função para verificar se o usuário existe
export const findUserByEmail = async (username) => {
    try {
        const db = await getDb();
        const query = 'SELECT id FROM users WHERE email = ?';
        const result = await db.get(query, [username]);
        return result;
    } catch (e) {
        console.error(e);
        throw new Error('Erro ao buscar usuário');
    }
};

// Função para criar um novo usuário
export const createUser = async (email, password, username) => {
    try {
        const db = await getDb();
        await db.run('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, password, username]);
        return true;
    } catch (e) {
        console.error(e);
        throw new Error('Erro ao criar usuário');
    }
};
