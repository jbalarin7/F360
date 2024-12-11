import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando as rotas
import UserRoutes from './routes/UserRoutes.js';
import StockRoutes from './routes/StockRoutes.js';
import AssetRoutes from './routes/AssetRoutes.js';

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
// app.use((req, res, next) => {
//     console.log(req.session); // Logando a sessão no console a cada requisição
//     next();
//   });
  
// Registrando as rotas
app.use('/api/auth', UserRoutes);  // Rota de autenticação
app.use('/api/stock', StockRoutes);
app.use('/api/portfolio', AssetRoutes);

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor principal rodando na porta ${port}`);
});