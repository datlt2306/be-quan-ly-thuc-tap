import express from 'express';
import multer from 'multer';
import { report, submitRecordForm } from '../controllers/reportForm.controller';
import { isAuthenticateUser } from '../middlewares/CheckAuth';
import { checkRequestTime } from '../middlewares/CheckTimeRequest';

const router = express.Router();
const upload = multer();

router.patch('/upload/report', isAuthenticateUser, upload.any(), checkRequestTime, report);
router.patch('/upload/form', isAuthenticateUser, upload.any(), checkRequestTime, submitRecordForm);

export default router;
