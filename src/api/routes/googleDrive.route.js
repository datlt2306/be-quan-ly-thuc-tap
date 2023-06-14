import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/googleDrive.controller';
import { isAuthenticateUser } from '../middlewares/CheckAuth';

const upload = multer();
const router = express.Router();

router.post('/drive/upload', upload.any(), isAuthenticateUser, uploadFile);

export default router;
