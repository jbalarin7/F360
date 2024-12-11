import AssetDAO from '../daos/AssetDAO.js';
import UserDAO from '../daos/UserDAO.js';

class AssetService {
    static async searchUserAssets(userId) {
        try {
          // Verifica se o usuário existe
          const user = await UserDAO.findUserById(userId);
          if (!user) {
            throw new Error('Usuário não encontrado');
          }
    
          // Se o usuário existir, busca os ativos (Assets) desse usuário
          const assets = await AssetDAO.findAssetsByUserId(userId);
          return assets;
        } catch (error) {
          console.error('Erro ao buscar ativos do usuário:', error);
          throw new Error('Erro ao buscar ativos do usuário');
        }
      }

    static async createUserAsset(userId, assetData) {
        const user = await UserDAO.findUserById(userId);
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }
        return await AssetDAO.createAsset(userId, assetData);
    }

    static async updateUserAsset(userId, assetId, assetData) {
        const user = await UserDAO.findUserById(userId);
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }
        return await AssetDAO.updateAsset(userId, assetId, assetData);
    }

    static async deleteUserAsset(id) {
      try {
          // Chama o DAO para excluir o ativo
          const assetDeleted = await AssetDAO.deleteAsset(id);
          if (!assetDeleted) {
              throw new Error('Ativo não encontrado');
          }
          return { success: true, message: 'Ativo excluído com sucesso.' };
      } catch (error) {
          throw new Error('Erro ao excluir o ativo: ' + error.message);
      }
    }
}

export default AssetService;