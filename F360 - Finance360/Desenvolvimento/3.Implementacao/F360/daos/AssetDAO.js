import models from '../models/index.js';

const Asset = models.Asset;

class AssetDAO {
    static async findAssetsByUserId(userId) {
      try {
        const assets = await Asset.findAll({
          where: { user_id: userId },
          attributes: ['id', 'name', 'value', 'quantity'],
        });
        return assets.map(asset => asset.toJSON()); // Retorna os ativos encontrados
      } catch (error) {
        console.error('Erro ao buscar ativos do usuário:', error);
        throw new Error('Erro ao buscar ativos do usuário');
      }
    }

    static async createAsset(userId, assetData) {
      if (!assetData.acquisition_date) {
        assetData.acquisition_date = (new Date()).toISOString().slice(0, 10); // Atribui a data de hoje
        console.log(assetData.acquisition_date)
      }
      console.log(assetData)

      return await Asset.create({ ...assetData, user_id: userId });
    }

    static async updateAsset(userId, assetId, assetData) {
      console.log(assetId);
      const asset = await Asset.findOne({ where: { id: assetId, user_id: userId } });
      if (!asset) {
        throw new Error('Ativo não encontrado ou não pertence ao usuário.');
      }
      return await asset.update(assetData);
    }

    static async deleteAsset(id) {
      try {
          const result = await Asset.destroy({
              where: { id }
          });
          return result > 0; // Retorna true se o ativo foi deletado
      } catch (error) {
          throw new Error('Erro ao excluir o ativo: ' + error.message);
      }
    }
  }
  
  export default AssetDAO;
  