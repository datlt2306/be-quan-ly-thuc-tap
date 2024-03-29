import express from 'express';
import { role } from '../../utils/role';
import {
	createbusiness,
	getBusiness,
	importBusiness,
	listBusiness,
	removeBusiness,
	updateBusiness,
	updateMany
} from '../controllers/business.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
const router = express.Router();

router.put('/business', isAuthenticateUser, authorizeRoles([role.staff]), importBusiness);

//! DEPRECATED POST /business, POST /business/new
router.post('/business/new', isAuthenticateUser, authorizeRoles([role.staff]), createbusiness);
router.patch('/business/:id', isAuthenticateUser, authorizeRoles([role.staff]), updateBusiness);
router.patch('/business', isAuthenticateUser, authorizeRoles([role.staff]), updateMany);
router.get('/business', isAuthenticateUser, listBusiness);
router.get('/business/:id', isAuthenticateUser, getBusiness);
router.delete('/business/:id', isAuthenticateUser, authorizeRoles([role.staff]), removeBusiness);

export default router;
