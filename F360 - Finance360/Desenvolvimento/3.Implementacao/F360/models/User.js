import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db.js';

class User extends Model {
  static associate(models) {
    // Definindo a associação como um método estático
    this.hasMany(models.Asset, {
      foreignKey: 'user_id',
      as: 'assets', // Nome da relação (pode ser usado para acessar os assets do usuário)
      onDelete: 'CASCADE', // Se um User for excluído, os Assets também serão excluídos
    });
  }
}

User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Definindo explicitamente a chave primária
        autoIncrement: true, // Valor auto-incrementável
      },        
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users', // Nome da tabela no banco
        timestamps: true, // Ativa a geração automática de createdAt e updatedAt
        createdAt: 'created_at', // Nome da coluna customizada para createdAt
        updatedAt: 'updated_at', // Nome da coluna customizada para updatedAt
      }
  );

export default User;
