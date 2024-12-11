import StockDataService from '../services/StockDataService.js';

class StockDataController {

  static async searchStockData(req, res) {
    const { ticker } = req.params;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker é obrigatório.' });
    }
    try {
      const stockData = await StockDataService.searchStockData(ticker);
      return res.status(200).json(stockData);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async searchPerformingStocksToday(req, res) {
    const order = req.query.order === 'true'; // Verifica a query string
    try {
      // Chama o Service que realiza a lógica de negócio
      const stocks = await StockDataService.getStocksByPerformance(order);
      
      if (stocks && stocks.length > 0) {
        return res.status(200).json(stocks); // Retorna as ações se encontradas
      } else {
        return res.status(404).json({ error: 'Ações não encontradas' }); // Retorna erro 404 caso não encontre
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados' }); // Retorna erro 500 se falhar
    }
  }

  static async searchMostTradedStocksToday(req, res) {
    try {
      // Chama o Service para obter as ações mais negociadas
      const stocks = await StockDataService.getMostTradedStocksToday();
      
      if (stocks && stocks.length > 0) {
        return res.status(200).json(stocks); // Retorna as ações se encontradas
      } else {
        return res.status(404).json({ error: 'Ações não encontradas' }); // Retorna erro 404 caso não encontre
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados' }); // Retorna erro 500 se falhar
    }
  }

  static async searchStockHistory(req, res) {
    const { ticker } = req.params;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker é necessário' });
    }
    try {
      const history = await StockDataService.getStockHistory(ticker);
      if (history && history.length > 0) {
        return res.status(200).json(history);
      } else {
        return res.status(404).json({ error: 'Histórico não encontrado' });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
    }
  }
}

export default StockDataController;
