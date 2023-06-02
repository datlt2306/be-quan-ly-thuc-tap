import express from 'express';
import { listReviewer, listReviewForm, reviewReport } from '../controllers/reviewer.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';
import { role } from '../../utils/role';
const router = express.Router();
router.get('/review', isAuthenticateUser, authorizeRoles([role.staff]), listReviewer);
router.get('/reivewForm', isAuthenticateUser, authorizeRoles([role.staff]), listReviewForm);
router.get('/reivewReport', isAuthenticateUser, authorizeRoles([role.staff]), reviewReport);

export default router;
