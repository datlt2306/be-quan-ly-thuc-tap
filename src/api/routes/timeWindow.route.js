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
router.get(
	'/settime/byNumber/:typeNumber',
	isAuthenticateUser,
	authorizeRoles([role.manager]),
	getOneTypeSetTime
);
router.get('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), getTimeWindowByID);
router.get('/settime', isAuthenticateUser, authorizeRoles([role.manager]), getListTypeSetTime);
router.patch('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateSetTime);
router.delete('/settime/:id', isAuthenticateUser, authorizeRoles([role.manager]), deleteSetTime);

module.exports = router;
