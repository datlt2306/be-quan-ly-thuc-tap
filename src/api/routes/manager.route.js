import express from 'express';
import {
	createManager,
	getListManager,
	getManager,
	permittedCreateManager,
	permittedListManager,
	permittedUpdateManager,
	removeManager,
	updateManager
} from '../controllers/manager.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

// * ADMIN ROUTE
router.get('/admin/manager', isAuthenticateUser, authorizeRoles([role.admin]), permittedListManager);
router.post('/admin/manager', isAuthenticateUser, authorizeRoles([role.admin]), permittedCreateManager);
router.patch('/admin/manager/:id', isAuthenticateUser, authorizeRoles([role.admin]), permittedUpdateManager);

router.get('/manager', isAuthenticateUser, authorizeRoles([role.student], true), getListManager);
router.get('/manager/:id', isAuthenticateUser, authorizeRoles([role.student], true), getManager);
router.post('/manager', isAuthenticateUser, authorizeRoles([role.student], true), createManager);
router.patch('/manager/:id', isAuthenticateUser, authorizeRoles([role.student], true), updateManager);
router.delete('/manager/:id', isAuthenticateUser, authorizeRoles([role.student], true), removeManager);

export default router;
