import express from 'express';
import {
	createbusiness,
	getBusiness,
	insertBusiness,
	insertBusinessList,
	listBusiness,
	removeBusiness,
	updateBusiness,
	updateMany,
} from '../controllers/business.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';
const router = express.Router();

router.put('/business', isAuthenticateUser, insertBusinessList);

//! DEPRECATED POST /business, POST /business/new
router.post('/business', isAuthenticateUser, authorizeRoles([role.manager]), insertBusiness);
router.post('/business/new', isAuthenticateUser, authorizeRoles([role.manager]), createbusiness);
router.patch('/business/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateBusiness);
router.patch('/business', isAuthenticateUser, authorizeRoles([role.manager]), updateMany);

router.get('/business', isAuthenticateUser, listBusiness);
router.get('/business/:id', isAuthenticateUser, getBusiness);
router.delete('/business/:id', isAuthenticateUser, authorizeRoles([role.manager]), removeBusiness);

export default router;
