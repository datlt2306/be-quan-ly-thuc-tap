import express from 'express';
import { createCampus, getCampus, getListCampus, removeCampus, updateCampus } from '../controllers/campus.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';

const router = express.Router();

router.get('/campus', getListCampus);
router.get('/campus/:id', getCampus);
router.post('/campus', isAuthenticateUser, authorizeRoles([role.admin]), createCampus);
router.patch('/campus/:id', isAuthenticateUser, authorizeRoles([role.admin]), updateCampus);
router.delete('/campus/:id', isAuthenticateUser, authorizeRoles([role.admin]), removeCampus);

export default router;
