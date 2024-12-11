import UserDAO from '../daos/UserDAO.js';
import bcrypt from 'bcrypt';

class UserService {
  // Lógica de registro de usuário
  static async registerUser(email, password) {
    
    const existingUser = await UserDAO.findUserByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já está em uso.');
    }

    const newUser = await UserDAO.createUser(email, password);
    return { id: newUser.id, email: newUser.email, username: newUser.username };
  }

  // Lógica de autenticação de usuário
  static async authenticateUser(email, password) {
    const user = await UserDAO.findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const isPasswordValid = await UserService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha incorreta.');
    }

    return { id: user.id, email: user.email };
  }

  // Método para validar senha
  static async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

export default UserService;
