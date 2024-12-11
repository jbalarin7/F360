import express from 'express';
import AssetController from '../controllers/AssetController.js';


const router = express.Router();

router.get('/investments', AssetController.searchUserAssets);
router.post('/investments', AssetController.createUserAsset);
router.put('/investments/:id', AssetController.updateUserAsset);
router.delete('/investments/:id', AssetController.deleteUserAsset);


export default router;