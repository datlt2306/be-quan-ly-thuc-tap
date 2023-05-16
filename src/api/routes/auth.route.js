import express from 'express';
import { loginGoogle, logout } from "../controllers/auth.controller";
import { isAuthenticateUser } from '../middlewares/CheckAuth'

const router = express.Router();

router.post('/login-google', loginGoogle)
router.get('/logout',isAuthenticateUser, logout)

module.exports = router