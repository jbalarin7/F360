import models from '../models/index.js';
import { Op } from 'sequelize';

const Stock = models.Stock;

class StockDAO {

  static async findStocksByKey(key) {
    try {
      return await Stock.findAll({
        where: {
          [Op.or]: [
            { ticker: { [Op.like]: `%${key}%` } },
            { name: { [Op.like]: `%${key}%` } },
          ],
        },
        attributes: ['ticker', 'name'], // Campos a serem retornados
        limit: 10, // Limite de resultados
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar ações');
    }
  }

  static async getStockIdByTicker(ticker) {
    try {
      const stock = await Stock.findOne({
        where: { ticker },
        attributes: ['id'], // Seleciona apenas o id
      });

      return stock ? stock.id : null; // Retorna o id ou null se não encontrar
    } catch (error) {
      console.error('Erro ao buscar o id da Stock:', error);
      throw new Error('Erro ao consultar Stock');
    }
  }
}

export default StockDAO;
