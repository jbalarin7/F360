import express from 'express';
import { searchMostTradedStocksToday, searchPerformingStocksToday, searchStockData, searchStocks } from '../controllers/stockController.js';


const router = express.Router();

router.get('/stocks', searchStocks);
router.get('/ranking', searchPerformingStocksToday);
router.get('/mosttraded', searchMostTradedStocksToday);
router.get('/:ticker', searchStockData);

export default router;