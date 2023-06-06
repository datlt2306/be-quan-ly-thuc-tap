const {
	sendRequestToManager,
	getRequestOfStudent,
	resetStudent,
	cancelResetStudent,
	processRequest
} = require('../controllers/requestStudent.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();
//* New endpoint. To replace /request/reset/:id && /request/remove/:id
router.patch('/request/process/:id', isAuthenticateUser, authorizeRoles([role.staff, role.manager]), processRequest);

router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);

router.get('/request', isAuthenticateUser, authorizeRoles([role.staff]), getRequestOfStudent);

//! DEPRECATED
router.patch('/resetStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), resetStudent);

router.patch('/removeRequest/:id', isAuthenticateUser, authorizeRoles([role.staff]), cancelResetStudent);

export default router;
