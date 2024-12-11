import StockDataDAO from '../daos/StockDataDAO.js'; // DAO para lidar com a persistência
import StockDAO from '../daos/StockDAO.js'; // DAO para lidar com a persistência
import fetch from 'node-fetch';

class StockDataService {
  static async searchStockData(ticker) {

    // Tenta buscar dados recentes no banco de dados
    let stockData = await StockDataDAO.findRecentStockDataByTicker(ticker);
    if (stockData) {
      return stockData;
    }

    // Busca dados na API externa se não encontrar no banco
    const brapiToken = global.brapiToken; // Token da API externa
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}`, {
      headers: {
        'Authorization': `Bearer ${brapiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter dados da API externa: ${response.statusText}`);
    }

    const { results: [data] } = await response.json();

    // Valida os dados retornados da API
    const requiredFields = [
      'symbol',
      'regularMarketChangePercent',
      'longName',
      'regularMarketTime',
      'regularMarketOpen',
      'regularMarketPreviousClose',
      'regularMarketVolume',
      'earningsPerShare',
    ];

    const hasAllFields = requiredFields.every(field => data.hasOwnProperty(field));
    if (!hasAllFields) {
      throw new Error('Erro: Dados incompletos recebidos da API externa.');
    }

    const stock_id = await StockDAO.getStockIdByTicker(data.symbol);
    if (!stock_id) {
        throw new Error('Ticker não encontrado para Stock');
    }

    const {
        currency,
        shortName: short_name,  // Renomeando a chave para o padrão do banco
        longName: long_name,
        regularMarketChange: regular_market_change,
        regularMarketChangePercent: regular_market_change_percent,
        regularMarketTime: regular_market_time,
        regularMarketPrice: regular_market_price,
        regularMarketDayHigh: regular_market_day_high,
        regularMarketDayRange: regular_market_day_range,
        regularMarketDayLow: regular_market_day_low,
        regularMarketVolume: regular_market_volume,
        regularMarketPreviousClose: regular_market_previous_close,
        regularMarketOpen: regular_market_open,
        fiftyTwoWeekRange: fifty_two_week_range,
        fiftyTwoWeekLow: fifty_two_week_low,
        fiftyTwoWeekHigh: fifty_two_week_high,
        symbol,
        priceEarnings: price_earnings,
        earningsPerShare: earnings_per_share,
        logourl
      } = data

    // Salva os dados no banco
    const stockDataCreated = await StockDataDAO.createStockData({
        currency,
        short_name,
        long_name,
        regular_market_change,
        regular_market_change_percent,
        regular_market_time,
        regular_market_price,
        regular_market_day_high,
        regular_market_day_range,
        regular_market_day_low,
        regular_market_volume,
        regular_market_previous_close,
        regular_market_open,
        fifty_two_week_range,
        fifty_two_week_low,
        fifty_two_week_high,
        symbol,
        price_earnings,
        earnings_per_share,
        logourl,
        stock_id,
    });

    if (stockDataCreated) {
      stockData = await StockDataDAO.findRecentStockDataByTicker(ticker);
      if (stockData) return stockData;
    }

    throw new Error('Erro ao salvar e buscar dados da ação');
  }

  static async getStocksByPerformance(orderDirection) {
    try {
      // Chama a função do DAO para obter os dados
      const stocks = await StockDataDAO.getStocksByPerformance(orderDirection);
      
      // Aqui você pode adicionar qualquer lógica extra que precisar, caso haja
      return stocks;
    } catch (e) {
      console.error('Erro no serviço ao buscar ações:', e);
      throw new Error('Erro ao buscar ações com performance.');
    }
  }

  static async getMostTradedStocksToday() {
    try {
      const stocks = await StockDataDAO.getMostTradedStocksToday();
      return stocks;
    } catch (e) {
      console.error('Erro no serviço ao buscar ações mais negociadas:', e);
      throw new Error('Erro ao buscar ações mais negociadas no dia.');
    }
  }

  static async getStockHistory(ticker) {
    try {
      // Chama o método estático no StockDataDAO
      const history = await StockDataDAO.getStockHistory(ticker);
      return history;
    } catch (e) {
      console.error('Erro no Service:', e);
      throw new Error('Erro ao buscar histórico de ações');
    }
  }
}

export default StockDataService;
