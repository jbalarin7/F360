import User from './User.js';
import Stock from './Stock.js';
import Asset from './Asset.js';
import StockData from './StockData.js';
import sequelize from '../database/db.js';

// Adiciona os modelos ao Sequelize
const models = {
  User,
  Stock,
  Asset,
  StockData,
};

// Define as associações
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Exporta os modelos
export default models;
