import express from 'express';
import { role } from '../../utils/role';
import {
	cancelResetStudent,
	processStudentRequest,
	resetStudent,
	sendRequestToManager,
	getRequestOfStudent
} from '../controllers/studentRequest.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';

const router = express.Router();
router.patch('/request/:id', isAuthenticateUser, authorizeRoles([role.staff, role.manager]), processStudentRequest);
router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);
router.get('/request', isAuthenticateUser, authorizeRoles([role.staff]), getRequestOfStudent);

export default router;
