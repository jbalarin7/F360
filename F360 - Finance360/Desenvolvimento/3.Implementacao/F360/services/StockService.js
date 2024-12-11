import StockDAO from '../daos/StockDAO.js';

class StockService {
  static async searchStocks(key) {
    return await StockDAO.findStocksByKey(key);
  }
}

export default StockService;
