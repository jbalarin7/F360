import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';


const router = express.Router();

// Registro de usuários
router.post('/register', registerUser);

// Login de usuários
router.post('/login', loginUser);

// Rota para logout
router.post('/logout', logoutUser);


export default router;