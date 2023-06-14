import {
	getListToken,
	getTokenByStudentId,
	updateTokenDevice,
	createToken,
	removeTokenDevice
} from '../controllers/tokenDevice.controller';
import express from 'express';

const router = express.Router();

router.get('/tokens', getListToken);
router.get('/tokens/:student_id', getTokenByStudentId);
router.post('/token', createToken);
router.put('/tokens/:id', updateTokenDevice);
router.delete('/token', removeTokenDevice);

export default router;
