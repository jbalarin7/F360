import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando as rotas
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();
// Verifica se as variáveis necessárias estão definidas

if (!process.env.SESSION_SECRET) {
    console.error("Erro: A variável de ambiente SESSION_SECRET não está definida!");
    process.exit(1);  // Encerra a aplicação com código de erro
}

if (!process.env.BRAPI_TOKEN) {
    console.error("Erro: A variável de ambiente BRAPI_TOKEN não está definida!");
    process.exit(1);  // Encerra a aplicação com código de erro
}

if (!process.env.PORT) {
    console.error("Erro: A variável de ambiente PORT não está definida!");
    process.exit(1);  // Encerra a aplicação com código de erro
}

console.log("Variáveis de ambiente carregadas com sucesso!");

const brapiToken = process.env.BRAPI_TOKEN;
global.brapiToken = brapiToken;

const sessionSecret = process.env.SESSION_SECRET;
const port = process.env.PORT;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: sessionSecret, // Chave secreta para assinar as sessões
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,           // Define se o cookie será apenas para conexões HTTPS (em produção, true)
        maxAge: 3600000          // Define o tempo de expiração do cookie (1 hora)
    }
}));

// Registrando as rotas
app.use('/api/auth', authRoutes);  // Rota de autenticação
app.use('/api/stock', stockRoutes);  // Rota de autenticação

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor principal rodando na porta ${port}`);
});