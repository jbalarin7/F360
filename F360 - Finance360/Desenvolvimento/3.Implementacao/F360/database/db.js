import { Sequelize } from 'sequelize';

// Conexão com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/db.db',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate(); // Testa a conexão
    console.log('Conexão estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  }
})();

export default sequelize;