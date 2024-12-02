import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import investmentRoutes from './routes/investmentRoutes.js';
import dividendsRoutes from './routes/dividendsRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import cors from 'cors';

const app = express();

app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

dotenv.config();

// Configurar __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/auth', authRoutes);
app.use('/api/investments', portfolioRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/dividends', dividendsRoutes);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
