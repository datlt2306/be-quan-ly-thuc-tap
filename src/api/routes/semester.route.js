const { getSemester, insertSemester, updateSemester, defaultSemester } = require('../controllers/semester.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { role } = require('../../utils/role');

const router = require('express').Router();

router.get('/semester', getSemester);
router.get('/semester/default', defaultSemester);
router.post('/semester', isAuthenticateUser, authorizeRoles([role.manager]), insertSemester);
router.patch('/semester/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateSemester);

export default router;
