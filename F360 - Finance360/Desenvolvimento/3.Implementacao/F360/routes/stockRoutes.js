import express from 'express';
import StockController from '../controllers/StockController.js';
import StockDataController from '../controllers/StockDataController.js';


const router = express.Router();

router.get('/stocks', StockController.search);
router.get('/ranking', StockDataController.searchPerformingStocksToday);
router.get('/mosttraded', StockDataController.searchMostTradedStocksToday);
router.get('/:ticker', StockDataController.searchStockData);
router.get('/stock-history/:ticker', StockDataController.searchStockHistory)

export default router;