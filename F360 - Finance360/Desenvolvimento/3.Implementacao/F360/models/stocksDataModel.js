import getDb from '../database/db.js'; // Banco de dados
import { getStockIdByTicker } from './stocksModel.js';

// Função para verificar se o usuário existe
export const findRecentStockDataByTicker = async (ticker) => {
  try {
    const db = await getDb();
    const thirtyMinutesAgo = new Date(new Date() - (30 * 60 * 1000) - (3 * 60 * 60 * 1000));
    let result;
    if (thirtyMinutesAgo.getHours() < 10 || thirtyMinutesAgo.getHours() > 18) {
      const query = `
          SELECT symbol, regular_market_change_percent, long_name, regular_market_time , regular_market_open, regular_market_previous_close, regular_market_volume, earnings_per_share, logourl
          FROM stocks_data
          WHERE symbol = ? 
          ORDER BY regular_market_time DESC
          LIMIT 1;
      `;
      result = await db.get(query, [ticker]);
    } else {
      let strThirtyMinutesAgo = thirtyMinutesAgo.toISOString();
      const query = `
          SELECT symbol, regular_market_change_percent, long_name, regular_market_time , regular_market_open, regular_market_previous_close, regular_market_volume, earnings_per_share
          FROM stocks_data
          WHERE symbol = ? 
          AND regular_market_time >= ?
          LIMIT 1;
      `;
      result = await db.get(query, [ticker, strThirtyMinutesAgo]);
    }
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Erro ao buscar dados recentes da Ação');
  }
};

export const getStocksByPerformance = async (orderDirection) => {
  try {
    const db = await getDb();
    let today = new Date(new Date() - (3 * 60 * 60 * 1000));
    if (today.getHours() < 10) today = new Date(new Date() - (24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
    const query = `
        SELECT symbol, MAX(regular_market_time), regular_market_change_percent
        FROM stocks_data
        WHERE regular_market_time LIKE ?
        GROUP BY symbol
        ORDER BY regular_market_change_percent ${orderDirection ? 'DESC' : 'ASC'}
        LIMIT 5;
        `;
    return await db.all(query, [`${today}%`]);
  } catch (e) {
    console.error(e);
    throw new Error(`Erro ao buscar Ações com ${orderDirection ? 'melhor' : 'pior'} performance no dia.`);
  }
}

export const getMostTradedStocksToday = async () => {
  try {
    const db = await getDb();
    const today = new Date().toISOString().slice(0, 10);
    const query = `
        SELECT symbol, regular_market_volume
        FROM stocks_data
        WHERE regular_market_time LIKE ?
        GROUP BY symbol
        ORDER BY regular_market_volume DESC
        LIMIT 5;
        `;
    return await db.all(query, [`${today}%`]);
  } catch (e) {
    console.error(e);
    throw new Error(`Erro ao buscar Ações com maior volume no dia.`);
  }
}

export const createStockData = async (dataObj) => {
  try {
    const {
      currency,
      shortName: short_name,  // Renomeando a chave para seguir o padrão
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
    } = dataObj;

    const [{ id: stock_id }] = await getStockIdByTicker(symbol);
    if (!stock_id) throw new Error("Ação não encontrada na tabela de ações.")
    
    const db = await getDb();

    await db.run(`
        INSERT INTO stocks_data (
          stock_id, 
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
          logourl
        ) 
        VALUES (
          ?,  -- stock_id
          ?,  -- currency
          ?,  -- short_name
          ?,  -- long_name
          ?,  -- regular_market_change
          ?,  -- regular_market_change_percent
          ?,  -- regular_market_time
          ?,  -- regular_market_price
          ?,  -- regular_market_day_high
          ?,  -- regular_market_day_range
          ?,  -- regular_market_day_low
          ?,  -- regular_market_volume
          ?,  -- regular_market_previous_close
          ?,  -- regular_market_open
          ?,  -- fifty_two_week_range
          ?,  -- fifty_two_week_low
          ?,  -- fifty_two_week_high
          ?,  -- symbol
          ?,  -- price_earnings
          ?,  -- earnings_per_share
          ?   -- logourl
        );
      `, [
      stock_id,  // substitua com o valor correspondente
      currency,  // substitua com o valor correspondente
      short_name, // substitua com o valor correspondente
      long_name, // substitua com o valor correspondente
      regular_market_change, // substitua com o valor correspondente
      regular_market_change_percent, // substitua com o valor correspondente
      regular_market_time, // substitua com o valor correspondente
      regular_market_price, // substitua com o valor correspondente
      regular_market_day_high, // substitua com o valor correspondente
      regular_market_day_range, // substitua com o valor correspondente
      regular_market_day_low, // substitua com o valor correspondente
      regular_market_volume, // substitua com o valor correspondente
      regular_market_previous_close, // substitua com o valor correspondente
      regular_market_open, // substitua com o valor correspondente
      fifty_two_week_range, // substitua com o valor correspondente
      fifty_two_week_low, // substitua com o valor correspondente
      fifty_two_week_high, // substitua com o valor correspondente
      symbol, // substitua com o valor correspondente
      price_earnings, // substitua com o valor correspondente
      earnings_per_share, // substitua com o valor correspondente
      logourl // substitua com o valor correspondente
    ]);

    return true;
  }
  catch (e) {
    console.error(e);
    throw new Error(`Erro ao inserir dados da ação no dia.`);
  }
}