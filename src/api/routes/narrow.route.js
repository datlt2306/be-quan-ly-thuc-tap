const {
	getNarrow,
	insertNarrow,
	updateNarrow,
	deleteNarrow
} = require('../controllers/narrowSpecialization.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();

router.get('/narrows', isAuthenticateUser, getNarrow);
router.post('/narrow', isAuthenticateUser, authorizeRoles([role.manager]), insertNarrow);
router.put('/narrow/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateNarrow);
router.delete('/narrow/:id', isAuthenticateUser, authorizeRoles([role.manager]), deleteNarrow);

export default router;
