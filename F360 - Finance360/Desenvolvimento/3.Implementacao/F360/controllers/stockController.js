import StockService from '../services/StockService.js';

class StockController {
  static async search(req, res) {
    try {
      const { key } = req.query;
      // Validação simples
      if (!key || typeof key !== 'string') {
          return res.status(400).json({ error: 'Chave de busca inválida' });
      }

      const stocks = await StockService.searchStocks(key);
      return res.json(stocks);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default StockController;
