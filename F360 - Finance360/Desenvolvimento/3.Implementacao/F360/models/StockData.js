import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database/db.js'; // Conexão com o banco

class StockData extends Model {
  static associate(models) {
    // Relacionamento de StockData com Stock
    this.belongsTo(models.Stock, {
      foreignKey: 'stock_id', // Nome da chave estrangeira na tabela StockData
      as: 'stock', // Nome da relação (será usado para acessar a Stock relacionada a StockData)
      onDelete: 'CASCADE', // Quando um Stock for excluído, os StockData correspondentes também serão excluídos
    });
  }
}

StockData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto incremento
    },
    stock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stocks', // Nome da tabela referenciada
        key: 'id', // Chave primária da tabela de referência
      },
      onDelete: 'CASCADE', // Ação em caso de exclusão no modelo de referência
    },
    currency: {
      type: DataTypes.STRING,
    },
    short_name: {
      type: DataTypes.STRING,
    },
    long_name: {
      type: DataTypes.STRING,
    },
    regular_market_change: {
      type: DataTypes.FLOAT,
    },
    regular_market_change_percent: {
      type: DataTypes.FLOAT,
    },
    regular_market_time: {
      type: DataTypes.STRING, // Pode ser adaptado para Date caso preferir
    },
    regular_market_price: {
      type: DataTypes.FLOAT,
    },
    regular_market_day_high: {
      type: DataTypes.FLOAT,
    },
    regular_market_day_range: {
      type: DataTypes.STRING,
    },
    regular_market_day_low: {
      type: DataTypes.FLOAT,
    },
    regular_market_volume: {
      type: DataTypes.INTEGER,
    },
    regular_market_previous_close: {
      type: DataTypes.FLOAT,
    },
    regular_market_open: {
      type: DataTypes.FLOAT,
    },
    fifty_two_week_range: {
      type: DataTypes.STRING,
    },
    fifty_two_week_low: {
      type: DataTypes.FLOAT,
    },
    fifty_two_week_high: {
      type: DataTypes.FLOAT,
    },
    symbol: {
      type: DataTypes.STRING,
    },
    price_earnings: {
      type: DataTypes.FLOAT,
    },
    earnings_per_share: {
      type: DataTypes.FLOAT,
    },
    logourl: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal('(strftime("%s", "now"))'), // SQLite para criar o timestamp
    },
    updated_at: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal('(strftime("%s", "now"))'), // SQLite para criar o timestamp
    },
  },
  {
    sequelize,
    modelName: 'StockData', // Nome do modelo
    tableName: 'stocks_data', // Nome da tabela no banco
    timestamps: true, // Ativa o gerenciamento automático de created_at e updated_at
    createdAt: 'created_at', // Define a coluna customizada para createdAt
    updatedAt: 'updated_at', // Define a coluna customizada para updatedAt
  }
);

export default StockData;
