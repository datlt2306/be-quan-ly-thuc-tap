import express from 'express';
import {
	createMajor,
	getListMajor,
	getMajor,
	removeMajor,
	updateMajor,
} from '../controllers/major.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get('/major', isAuthenticateUser, getListMajor);
router.get('/major/:id', isAuthenticateUser, getMajor);
router.post('/major', isAuthenticateUser, authorizeRoles([role.dev]), createMajor);
router.patch('/major/:id', isAuthenticateUser, authorizeRoles([role.dev]), updateMajor);
router.delete('/major/:id', isAuthenticateUser, authorizeRoles([role.dev]), removeMajor);

export default router;

