import getDb from '../database/db.js'; // Banco de dados

// Função para verificar se o usuário existe
export const findStocks = async (key) => {
  try {
    const db = await getDb();
    const query = `
                SELECT ticker, name
                FROM stocks
                WHERE ticker LIKE ? OR name LIKE ?
                LIMIT 10
                `;
    return await db.all(query, [`%${key}%`, `%${key}%`]);
  } catch (e) {
    console.error(e);
    throw new Error('Erro ao buscar Ações');
  }
};

export const getStockIdByTicker = async (ticker) => {
  try {
    const db = await getDb();
    const query = `
                SELECT id
                FROM stocks
                WHERE ticker = ?
                `;
    return await db.all(query, [ticker]);
  } catch (e) {
    console.error(e);
    throw new Error('Erro ao buscar Ação');
  }
}