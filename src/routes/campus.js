import express from 'express';
import {
	createCampus,
	getCampus,
	getListCampus,
	removeCampus,
	updateCampus,
} from '../controllers/campus';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../utils/role';

const router = express.Router();

router.get('/campus', getListCampus);
router.get('/campus/:id', getCampus);
router.post('/campus', isAuthenticateUser, authorizeRoles([role.dev]), createCampus);
router.patch('/campus/:id', isAuthenticateUser, authorizeRoles([role.dev]), updateCampus);
router.delete('/campus/:id', isAuthenticateUser, authorizeRoles([role.dev]), removeCampus);

module.exports = router;
