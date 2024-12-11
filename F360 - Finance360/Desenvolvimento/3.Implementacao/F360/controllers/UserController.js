import UserService from '../services/UserService.js';

class UserController {
  
    static async registerUser(req, res) {
      const { email, password } = req.body;
  
      // Validação simples
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }
  
      try {
        const newUser = await UserService.registerUser(email, password);
        res.status(201).json({ message: 'Usuário criado com sucesso.', user: newUser });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }

    static async relogUser(req, res) {
      if (req.session.userId) {
        return res.redirect('/portfolio.html');
      } else {
        return res.redirect('/login.html');
      }
    }
  
    static async loginUser(req, res) {
      const { email, password } = req.body;
  
      // Validação simples
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }
  
      try {
        const user = await UserService.authenticateUser(email, password);
        req.session.userId = user.id;
        return res.status(200).json({ message: 'Login bem-sucedido.', user });
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    }

    static async logoutUser(req, res) {
        try {
          // Destroi a sessão do usuário
          req.session.destroy((err) => {
            if (err) {
              console.error('Erro ao destruir a sessão:', err);
              return res.status(500).json({ error: 'Erro ao encerrar sessão.' });
            }
            res.clearCookie('connect.sid'); // Remove o cookie de sessão do cliente (ajuste conforme o nome do cookie)

            return res.status(200).json({ message: 'Logout realizado com sucesso.' });
          });
        } catch (error) {
          console.error('Erro no logout:', error);
          res.status(500).json({ error: 'Erro ao realizar logout.' });
        }
    }
  }
  
  export default UserController;
  