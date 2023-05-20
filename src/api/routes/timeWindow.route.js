import express from 'express';
import {
	getTimeWindowByID,
	getListTypeSetTime,
	handleSetTimeRequest,
	getOneTypeSetTime,
	updateSetTime,
	deleteSetTime,
} from '../controllers/windowTime.controller';
import { isAuthenticateUser, authorizeRoles } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.post('/settime', isAuthenticateUser, authorizeRoles([role.manager]), handleSetTimeRequest);
router.get('/settime/byNumber', isAuthenticateUser, getOneTypeSetTime);
router.get('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), getTimeWindowByID);
router.get('/settime', isAuthenticateUser, getListTypeSetTime);
router.patch('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateSetTime);
router.delete('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), deleteSetTime);

export default router;
