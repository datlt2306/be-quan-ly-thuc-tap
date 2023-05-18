import express from 'express';
import { signUpCVForSupport } from '../controllers/applyIntern.controller';
import { isAuthenticateUser } from '../middlewares/CheckAuth';
import { checkRequestTime } from '../middlewares/CheckTimeRequest';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.patch(
	'/intern/support',
	isAuthenticateUser,
	upload.any(),
	checkRequestTime,
	signUpCVForSupport
);

module.exports = router;
