import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, '../database/db.db');

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

export default db; // Exporta o banco de dados como padrão
