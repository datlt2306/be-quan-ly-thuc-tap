const {
	sendRequestToManager,
	getRequestOfStudent,
	resetStudent,
	cancelResetStudent,
	processStudentRequest
} = require('../controllers/studentRequest.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();
//* New endpoint. To replace /request/reset/:id and /request/remove/:id
router.patch('/request/:id', isAuthenticateUser, authorizeRoles([role.staff, role.manager]), processStudentRequest);

router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);

router.get('/request', isAuthenticateUser, authorizeRoles([role.staff]), getRequestOfStudent);

//! DEPRECATED
router.patch('/resetStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), resetStudent);

router.patch('/removeRequest/:id', isAuthenticateUser, authorizeRoles([role.staff]), cancelResetStudent);

export default router;
