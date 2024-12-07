import { findStocks } from '../models/stocksModel.js'; // Importa o modelo de stocks
import { findRecentStockDataByTicker, createStockData, getStocksByPerformance, getMostTradedStocksToday } from '../models/stocksDataModel.js'; // Importa o modelo de stockData
import fetch from 'node-fetch';

export const searchStocks = async (req, res) => {
  const key = req.query.q;

  if (!key) {
    return res.status(400).json({ error: 'Key é necessária' });
  }

  try {
    const stocks = await findStocks(key)
    
    if (stocks && stocks.length > 0) {
      return res.status(200).json(stocks)
    } else {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
  }
};

export const searchStockData = async (req, res) => {
  const { ticker } = req.params;

  if (!ticker) return res.status(400).json({ error: 'Ticker é necessário' });

  try {
    let stockData = await findRecentStockDataByTicker(ticker);
    
    if (stockData) {
      return res.status(200).json(stockData)
    }

    const brapiToken = global.brapiToken;
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}`, {
      headers: {
        'Authorization': `Bearer ${brapiToken}`,
      },
    })

    if(!response.ok) {
      throw new Error(`Erro ao obter dados da API externa: ${response.statusText}`)
    }

    const { results: [data] } = await response.json();
    if(
      !data.hasOwnProperty('symbol') || 
      !data.hasOwnProperty('regularMarketChangePercent') || 
      !data.hasOwnProperty('longName') || 
      !data.hasOwnProperty('regularMarketTime') || 
      !data.hasOwnProperty('regularMarketOpen') || 
      !data.hasOwnProperty('regularMarketPreviousClose') || 
      !data.hasOwnProperty('regularMarketVolume') || 
      !data.hasOwnProperty('earningsPerShare')
      ) {
      throw new Error(`Erro ao obter dados da API externa: ${response.statusText}`)
    }

    const stockDataCreated = await createStockData(data);
    if (stockDataCreated) {
      stockData = await findRecentStockDataByTicker(ticker);
      if (stockData) return res.status(200).json(stockData);
    }

    return res.status(500).json({ error: 'Erro ao buscar dados da ação' });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao buscar dados da ação' });
  }

}

export const searchPerformingStocksToday = async (req, res) => {
  const order = req.query.order === 'true';
  console.log(order);
  try {
    const stocks = await getStocksByPerformance(order);
    if (stocks && stocks.length > 0) {
      return res.status(200).json(stocks)
    } else {
      return res.status(404).json({ error: 'Ações não encontradas' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
  }
};

export const searchMostTradedStocksToday = async (req, res) => {
  try {
    const stocks = await getMostTradedStocksToday();
    
    if (stocks && stocks.length > 0) {
      return res.status(200).json(stocks)
    } else {
      return res.status(404).json({ error: 'Ações não encontradas' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
  }
};