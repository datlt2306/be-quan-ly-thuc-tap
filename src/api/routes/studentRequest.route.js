const {
	sendRequestToManager,
	getRequestOfStudent,
	processStudentRequest
} = require('../controllers/studentRequest.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();

router.patch('/request/:id', isAuthenticateUser, authorizeRoles([role.staff]), processStudentRequest);

router.post('/request', isAuthenticateUser, authorizeRoles([role.student]), sendRequestToManager);

router.get('/request', isAuthenticateUser, authorizeRoles([role.staff]), getRequestOfStudent);

export default router;
