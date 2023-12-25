import { isAuthenticateUser, authorizeRoles } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';
import { getNarrow, insertNarrow, updateNarrow, deleteNarrow } from '../controllers/narrowSpecialization.controller';
import express from 'express';

const router = express.Router();

router.get('/narrows', isAuthenticateUser, getNarrow);
router.post('/narrow', isAuthenticateUser, authorizeRoles([role.manager]), insertNarrow);
router.put('/narrow/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateNarrow);
router.delete('/narrow/:id', isAuthenticateUser, authorizeRoles([role.manager]), deleteNarrow);

export default router;
