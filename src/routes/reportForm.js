const { report, form } = require('../controllers/reportFromController');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { checkRequestTime } = require('../middlewares/CheckTimeRequest');
const router = require('express').Router();

router.patch(
	'upload/report',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	report
);
router.patch(
	'upload/form',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	form
);

module.exports = router;
