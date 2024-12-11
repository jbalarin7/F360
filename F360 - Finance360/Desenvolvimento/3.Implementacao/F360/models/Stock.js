import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db.js';

class Stock extends Model {
    static associate(models) {
        // A Stock tem muitos StockData
        this.hasMany(models.StockData, {
          foreignKey: 'stock_id', // Chave estrangeira na tabela StockData
          as: 'stockData', // Nome da associação, será utilizado para acessar os StockData relacionados
          onDelete: 'CASCADE', // Exclui os StockData relacionados quando a Stock for excluída
        });
      }
}

Stock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Define como chave primária
      autoIncrement: true, // Auto-incrementável
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false, // Não permite valores nulos
    },
    ticker: {
      type: DataTypes.TEXT,
      allowNull: false, // Não permite valores nulos
    },
  },
  {
    sequelize, // Instância do Sequelize
    modelName: 'Stock', // Nome do modelo
    tableName: 'stocks', // Nome da tabela no banco de dados
    timestamps: false, // Desativa os campos createdAt e updatedAt
  }
);

export default Stock;
