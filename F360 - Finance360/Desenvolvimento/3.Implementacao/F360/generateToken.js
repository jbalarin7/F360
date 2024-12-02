import jwt from 'jsonwebtoken';

const secretKey = 'suaChaveSecreta'; // Substitua por uma chave secreta segura

// Dados que você quer embutir no token
const user = {
    id: 1,
    username: 'usuario_exemplo',
    email: 'usuario@exemplo.com'
};

// Gerar o token
const token = jwt.sign(user, secretKey, { expiresIn: '1h' }); // O token vai expirar em 1 hora

console.log('Token gerado:', token);