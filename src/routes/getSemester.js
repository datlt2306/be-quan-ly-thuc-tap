const {
	getSemester,
	insertSemester,
	updateSemester,
	getDefaultSemester,
} = require('../controllers/semesterController');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../utils/role');

const router = require('express').Router();

router.get('/semester', getSemester);
router.post('/add-mester', isAuthenticateUser, authorizeRoles([role.manager]), insertSemester);
router.patch(
	'/update-mester/:id',
	isAuthenticateUser,
	authorizeRoles([role.manager]),
	updateSemester
);
router.get('/semester/default', getDefaultSemester);
module.exports = router;
