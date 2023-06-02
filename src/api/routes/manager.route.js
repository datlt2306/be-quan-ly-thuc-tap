import express from 'express';
import {
	createManager,
	getListManager,
	getManager,
	removeManager,
	updateManager
} from '../controllers/manager.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get('/manager', isAuthenticateUser, authorizeRoles([role.manager, role.staff]), getListManager);

router.get('/manager/:id', isAuthenticateUser, authorizeRoles([role.manager, role.staff]), getManager);

router.post('/manager', isAuthenticateUser, authorizeRoles([role.manager]), createManager);
router.patch('/manager/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateManager);
router.delete('/manager/:id', isAuthenticateUser, authorizeRoles([role.manager]), removeManager);

export default router;
