const {
	getSemester,
	insertSemester,
	updateSemester,
	getDefaultSemester
} = require('../controllers/semester.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();

router.get('/semester', getSemester);
router.post('/semester', isAuthenticateUser, authorizeRoles([role.manager]), insertSemester);
router.patch('/semester/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateSemester);
router.get('/semester/default', getDefaultSemester);

export default router;
