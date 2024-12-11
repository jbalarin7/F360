import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database/db.js'; // Conexão com o banco

class Asset extends Model {
    static associate(models) {
        // Definindo a associação "muitos para um" entre Asset e User
        this.belongsTo(models.User, {
            foreignKey: 'user_id', // A chave estrangeira no modelo Asset
            as: 'user', // Alias para referenciar a associação
            onDelete: 'CASCADE', // Caso o usuário seja deletado, os ativos também serão
        });
    }
}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto incremento
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nome da tabela referenciada
        key: 'id', // Chave primária da tabela de referência
      },
      onDelete: 'CASCADE', // Ação em caso de exclusão no modelo de referência
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false, // Impede que o valor seja nulo
      defaultValue: 0, // Opcional: valor padrão, se necessário
    },
    acquisition_date: {
      type: DataTypes.STRING, // Pode ser `DataTypes.DATE` se quiser tratar como tipo de data
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal('(strftime("%s", "now"))'), // Utilizando SQLite para gerar timestamp
    },
    updated_at: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal('(strftime("%s", "now"))'),
    },
  },
  {
    sequelize,
    modelName: 'Asset', // Nome do modelo
    tableName: 'assets', // Nome da tabela no banco
    timestamps: true, // Ativa o gerenciamento automático de created_at e updated_at
    createdAt: 'created_at', // Define a coluna customizada para createdAt
    updatedAt: 'updated_at', // Define a coluna customizada para updatedAt
  }
);

export default Asset;
