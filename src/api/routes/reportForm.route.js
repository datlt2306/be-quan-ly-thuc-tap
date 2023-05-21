const { report, form } = require('../controllers/reportForm.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { checkRequestTime } = require('../middlewares/CheckTimeRequest');
const router = require('express').Router();
const multer = require('multer');
const upload = multer();

router.patch(
	'/report',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	upload.any(),
	report
);
router.patch(
	'/form',
	isAuthenticateUser,
	// authorizeRoles([1, 2]),
	checkRequestTime,
	upload.any(),
	form
);

export default router;

