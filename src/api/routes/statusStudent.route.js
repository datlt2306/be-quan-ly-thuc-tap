import express from 'express';
import {
	createStatusStudent,
	deleteStatusStudent,
	getStatusStudent,
	updateStatusStudent
} from '../controllers/statusStudent.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get('/statusStudent', isAuthenticateUser, getStatusStudent);
router.post('/statusStudent', isAuthenticateUser, authorizeRoles([role.staff]), createStatusStudent);
router.patch('/statusStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), updateStatusStudent);
router.delete('/statusStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), deleteStatusStudent);

export default router;
