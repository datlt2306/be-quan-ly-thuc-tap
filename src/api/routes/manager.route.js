import express from 'express';
import {
	createManager,
	getListManager,
	getManager,
	removeManager,
	updateManager,
} from '../controllers/manager.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get(
	'/manager',
	isAuthenticateUser,
	authorizeRoles([role.dev, role.manager]),
	getListManager
);

router.get(
	'/manager/:id',
	isAuthenticateUser,
	authorizeRoles([role.dev, role.manager]),
	getManager
);

router.post('/manager', isAuthenticateUser, authorizeRoles([role.dev]), createManager);
router.patch('/manager/:id', isAuthenticateUser, authorizeRoles([role.dev]), updateManager);
router.delete('/manager/:id', isAuthenticateUser, authorizeRoles([role.dev]), removeManager);

export default router;

