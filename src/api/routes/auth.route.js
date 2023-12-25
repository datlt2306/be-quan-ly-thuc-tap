import express from 'express';
import { loginGoogle, loginAdmin, logout } from '../controllers/auth.controller';
import { isAuthenticateUser } from '../middlewares/CheckAuth';

const router = express.Router();

router.post('/login-google', loginGoogle);
router.post('/login-admin', loginAdmin);
router.get('/logout', isAuthenticateUser, logout);

export default router;
