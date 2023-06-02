const {
	sendRequestToManager,
	getRequestOfStudent,
	resetStudent,
	cancelResetStudent
} = require('../controllers/requestStudent.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();

router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);

router.get('/getRequest', isAuthenticateUser, authorizeRoles([role.staff]), getRequestOfStudent);

router.patch('/resetStudent/:id', isAuthenticateUser, authorizeRoles([role.staff]), resetStudent);

router.patch('/removeRequest/:id', isAuthenticateUser, authorizeRoles([role.staff]), cancelResetStudent);

export default router;
