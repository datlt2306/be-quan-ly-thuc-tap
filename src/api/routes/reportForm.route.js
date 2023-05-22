const { report, form } = require('../controllers/reportForm.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
const { checkRequestTime } = require('../middlewares/CheckTimeRequest');
const router = require('express').Router();
const multer = require('multer');
const upload = multer();

router.patch('/upload/report', isAuthenticateUser, upload.any(), checkRequestTime, report);
router.patch('/upload/form', isAuthenticateUser, upload.any(), checkRequestTime, form);

export default router;
