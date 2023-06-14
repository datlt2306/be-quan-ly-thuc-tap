import express from 'express';
import { role } from '../../utils/role';
import {
	cancelResetStudent,
	processStudentRequest,
	resetStudent,
	sendRequestToManager
} from '../controllers/studentRequest.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';

const router = express.Router();
//* New endpoint. To replace /request/reset/:id and /request/remove/:id
router.patch('/request/:id', isAuthenticateUser, authorizeRoles([role.staff, role.manager]), processStudentRequest);
router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);

//! DEPRECATED
router.patch('/resetStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), resetStudent);
router.patch('/removeRequest/:id', isAuthenticateUser, authorizeRoles([role.staff]), cancelResetStudent);

export default router;
