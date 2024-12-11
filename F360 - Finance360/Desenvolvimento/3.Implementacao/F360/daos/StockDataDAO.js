import models from '../models/index.js';
import { Sequelize, Op } from 'sequelize';

const StockData = models.StockData;

class StockDataDAO {
  // Método para encontrar os dados recentes de uma ação pelo ticker
  static async findRecentStockDataByTicker(ticker) {
    try {
      // Calcula a data de 30 minutos atrás
      let thirtyMinutesAgo = new Date(new Date() - (30 * 60 * 1000) - (3 * 60 * 60 * 1000)); // Ajusta para fuso horário
      // Verifica se está fora do horário de mercado
      if (thirtyMinutesAgo.getUTCHours() < 10 || thirtyMinutesAgo.getUTCHours() > 18 || thirtyMinutesAgo.getDay() == 0 || thirtyMinutesAgo.getDay() == 6) {
        thirtyMinutesAgo = new Date(new Date(StockDataDAO.adjustDateToPreviousWorkDay()).setHours(18, 30) - (30 * 60 * 1000)); // Ajusta para fuso horário
      } 
      // Se for dentro do horário de mercado, retorna os dados após os 30 minutos atrás
      const result = await StockData.findOne({
        where: {
          symbol: ticker,
          regular_market_time: { [Op.gte]: thirtyMinutesAgo },
        },
        order: [['regular_market_time', 'DESC']],
      });

      return result ? result.toJSON() : null;

    } catch (e) {
      console.error(e);
      throw new Error('Erro ao buscar dados recentes da Ação');
    }
  }

  // Método de ajuste para o dia útil anterior
  static adjustDateToPreviousWorkDay() {
    let today = new Date(new Date() - (3 * 60 * 60 * 1000)); // Ajuste de fuso horário
    if (today.getUTCHours() < 10) {
      // Se for antes das 10h, move para o dia anterior
      today = new Date(today.setDate(today.getDate() - 1));
    }
    
    if (today.getDay() == 0) {
      // Se for domingo, move para sexta-feira
      today = new Date(today.setDate(today.getDate() - 2));
    } else if (today.getDay() == 6) {
      // Se for sábado, move para sexta-feira
      today = new Date(today.setDate(today.getDate() - 1));
    }
    return today.toISOString().slice(0, 10); // Retorna a data no formato YYYY-MM-DD
  }

  static async getStocksByPerformance(orderDirection) {
    try {
      const today = StockDataDAO.adjustDateToPreviousWorkDay(); // Ajuste da data para o último dia útil
      const stocks = await StockData.findAll({
        attributes: [
          'symbol',
          [Sequelize.fn('MAX', Sequelize.col('regular_market_time')), 'max_time'],
          'regular_market_change_percent'
        ],
        where: {
          regular_market_time: {
            [Op.like]: `${today}%` // Filtrando pelo dia ajustado
          }
        },
        group: ['symbol'],
        order: [
          ['regular_market_change_percent', orderDirection ? 'DESC' : 'ASC'] // Ordenação pela performance
        ],
        limit: 5
      });
      return stocks.map(stock => stock.toJSON());
    } catch (e) {
      console.error(e);
      throw new Error(`Erro ao buscar Ações com ${orderDirection ? 'melhor' : 'pior'} performance no dia.`);
    }
  }

  static async getMostTradedStocksToday() {
    try {
      let today = StockDataDAO.adjustDateToPreviousWorkDay(new Date()); // Ajuste de data
      const stocks = await StockData.findAll({
        attributes: [
          'symbol',
          'regular_market_volume',
        ],
        where: {
          regular_market_time: {
            [Op.like]: `${today}%`
          }
        },
        group: ['symbol'], // Agrupa por símbolo de ação
        order: [['regular_market_volume', 'DESC']], // Ordena pelo volume total
        limit: 5
      });

      return stocks.map(stock => stock.toJSON()); // Retorna os resultados como JSON
    } catch (e) {
      console.error(e);
      throw new Error('Erro ao buscar Ações com maior volume no dia.');
    }
  }

  // Método para criar StockData
  static async createStockData(data) {
    try {
      const newStockData = await StockData.create(data); // Cria um novo registro StockData com os dados passados
      return newStockData; // Retorna o novo StockData criado
    } catch (error) {
      console.error('Erro ao criar StockData:', error);
      throw new Error('Erro ao criar StockData');
    }
  }

  // Método estático para buscar o histórico de ações com base no ticker
  static async getStockHistory(ticker) {
    try {
      // Consulta utilizando o Sequelize
      const stockHistory = await StockData.findAll({
        attributes: ['regular_market_time', 'regular_market_previous_close'], // Seleciona os campos necessários
        where: { symbol: ticker }, // Filtra pelo ticker
        group: [StockData.sequelize.literal('symbol'), StockData.sequelize.literal('DATE(regular_market_time)')], // Agrupa pelos campos apropriados
        order: [['regular_market_time', 'DESC']], // Ordena por regular_market_time, em ordem decrescente
        limit: 10, // Limita os resultados a 10
      });

      return stockHistory; // Retorna o histórico de ações
    } catch (e) {
      console.error(e);
      throw new Error(`Erro ao buscar histórico de ações.`);
    }
  }  
}

export default StockDataDAO;
