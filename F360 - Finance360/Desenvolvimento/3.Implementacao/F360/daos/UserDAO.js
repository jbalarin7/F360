import models from '../models/index.js';
import bcrypt from 'bcrypt';

const User = models.User;

class UserDAO {
  static async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'password'],
      });
      return user ? user.toJSON() : null;
    } catch (e) {
      console.error('Erro ao buscar usuário:', e);
      throw new Error('Erro ao buscar usuário');
    }
  }

  static async createUser(email, password, username = null) {
    try {
      const hashedPassword = await UserDAO.hashPassword(password);
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
      return newUser.toJSON();
    } catch (e) {
      console.error('Erro ao criar usuário:', e);
      throw new Error('Erro ao criar usuário');
    }
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static async findUserById(id) {
    try {
      // Realiza a busca do usuário pelo ID
      const user = await User.findByPk(id);

      // Retorna o usuário encontrado ou null se não encontrar
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw new Error('Erro ao buscar usuário');
    }
  }
}

export default UserDAO;
