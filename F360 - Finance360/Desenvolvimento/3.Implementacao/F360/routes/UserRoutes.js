import express from 'express';
import UserController from '../controllers/UserController.js';


const router = express.Router();

// Registro de usuários
router.post('/register', UserController.registerUser);

// Login de usuários
router.post('/login', UserController.loginUser);
router.get('/login', UserController.relogUser);

// Rota para logout
router.post('/logout', UserController.logoutUser);


export default router;