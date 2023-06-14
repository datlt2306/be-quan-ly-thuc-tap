import { role } from '../../utils/role';
import express from 'express';
import { getSemester, insertSemester, updateSemester, defaultSemester } from '../controllers/semester.controller';
import { isAuthenticateUser, authorizeRoles } from '../middlewares/CheckAuth';

const router = express.Router();

router.get('/semester', getSemester);
router.get('/semester/default', defaultSemester);
router.post('/semester', isAuthenticateUser, authorizeRoles([role.staff]), insertSemester);
router.patch('/semester/:id', isAuthenticateUser, authorizeRoles([role.staff]), updateSemester);

export default router;
