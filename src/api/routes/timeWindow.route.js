import express from 'express';
import {
	getTimeWindowByID,
	getListTypeSetTime,
	handleSetTimeRequest,
	getOneTypeSetTime,
	updateSetTime,
	deleteSetTime,
	setTimeWindow,
} from '../controllers/timeWindow.controller';
import { isAuthenticateUser, authorizeRoles } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

//! DEPERECATED
router.post('/settime', isAuthenticateUser, authorizeRoles([role.manager]), handleSetTimeRequest);
router.patch('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateSetTime);

router.put('/settime', isAuthenticateUser, authorizeRoles([role.manager]), setTimeWindow);
router.get('/settime/byNumber', isAuthenticateUser, getOneTypeSetTime);
router.get('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), getTimeWindowByID);
router.get('/settime', isAuthenticateUser, getListTypeSetTime);
router.delete('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), deleteSetTime);

module.exports = router;
