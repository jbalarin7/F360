import AssetService from '../services/AssetService.js';

class AssetController {
  static async searchUserAssets(req, res) {
    try {
      // Verifica se o ID do usuário está presente na sessão
      if (!req.session.userId) {
        return res.status(401).json({message: 'Não autorizado.'});
      }
      const userId = req.session.userId;

      const assets = await AssetService.searchUserAssets(userId);
      return res.json(assets);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createUserAsset(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({message: 'Não autorizado.'});
      }
      const userId = req.session.userId;
      const { name, value, quantity } = req.body;

      const newAsset = await AssetService.createUserAsset(userId, { name, value, quantity });
      return res.status(201).json(newAsset);
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUserAsset(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({message: 'Não autorizado.'});
      }
      const userId = req.session.userId;
      const { id } = req.params;
      const { name, value, quantity} = req.body;

      const updatedAsset = await AssetService.updateUserAsset(userId, id, { name, value, quantity });
      return res.json(updatedAsset);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteUserAsset(req, res) {
    const { id } = req.params; // O id do ativo para exclusão, passado no url
    try {
        const result = await AssetService.deleteUserAsset(id);
        res.status(200).json(result); // Retorna uma resposta de sucesso
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message }); // Retorna erro caso algo dê errado
    }
  }
}

export default AssetController;
