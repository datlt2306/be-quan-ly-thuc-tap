import express from 'express';
import {
	createStatusStudent,
	deleteStatusStudent,
	getStatusStudent,
	updateStatusStudent,
} from '../controllers/StatusStudent.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get('/statusStudent', isAuthenticateUser, getStatusStudent);
router.post(
	'/statusStudent',
	isAuthenticateUser,
	authorizeRoles([role.manager]),
	createStatusStudent
);
router.patch(
	'/statusStudent/:id',
	isAuthenticateUser,
	authorizeRoles([role.manager]),
	updateStatusStudent
);
router.delete(
	'/statusStudent/:id',
	isAuthenticateUser,
	authorizeRoles([role.manager]),
	deleteStatusStudent
);

module.exports = router;
