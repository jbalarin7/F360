import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let databaseInstance = null;

// Função para abrir o banco de dados
const openDatabase = async () => {
    if (!databaseInstance) {
        databaseInstance = await open({
            filename: './database/db.db',
            driver: sqlite3.Database
        });
    }

    return databaseInstance;
};

// Exportando a função assíncrona para obter a conexão
const getDb = async () => {
    return await openDatabase();
};

export default getDb;