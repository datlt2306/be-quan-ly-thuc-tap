const { report, form } = require('../controllers/reportForm.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { checkRequestTime } = require('../middlewares/CheckTimeRequest');
const router = require('express').Router();

router.patch(
	'/report',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	report
);
router.patch(
	'/form',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	form
);

module.exports = router;
