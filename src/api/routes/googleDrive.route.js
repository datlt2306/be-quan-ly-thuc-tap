import express from 'express';
import { uploadFile } from '../controllers/googleDrive.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.post('/drive/upload', upload.any(), isAuthenticateUser, uploadFile);

export default router;

