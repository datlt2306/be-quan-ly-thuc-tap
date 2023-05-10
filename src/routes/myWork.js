import express from 'express';
import { listReviewer, listReviewForm, reviewReport } from '../controllers/reviewer';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../utils/role';
const router = express.Router();
router.get('/review', isAuthenticateUser, authorizeRoles([role.manager]), listReviewer);
router.get('/review/form', isAuthenticateUser, authorizeRoles([role.manager]), listReviewForm);
router.get('/review/report', isAuthenticateUser, authorizeRoles([role.manager]), reviewReport);

module.exports = router;
