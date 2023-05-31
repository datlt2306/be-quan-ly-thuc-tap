import express from 'express';
import { role } from '../../utils/role';
import {
	getStudentsToReview,
	importStudents,
	listStudent,
	readOneStudent,
	removeStudent,
	updateBusinessStudent,
	updateReviewerStudent,
	updateStatusStudent,
	updateStudent
} from '../controllers/student.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';

const router = express.Router();

router.get('/student/reviews', isAuthenticateUser, authorizeRoles([role.manager]), getStudentsToReview);
router.get('/student', isAuthenticateUser, authorizeRoles([role.manager]), listStudent);
router.get('/student/:id', isAuthenticateUser, readOneStudent);
router.post('/student', isAuthenticateUser, authorizeRoles([role.manager]), importStudents);
router.patch('/student', isAuthenticateUser, authorizeRoles([role.manager]), updateReviewerStudent);
router.patch('/student/business', isAuthenticateUser, authorizeRoles([role.manager]), updateBusinessStudent);
router.patch('/student/status', isAuthenticateUser, authorizeRoles([role.manager]), updateStatusStudent);
router.patch('/student/:id', isAuthenticateUser, authorizeRoles([role.manager]), updateStudent);
router.delete('/student/:id', isAuthenticateUser, authorizeRoles([role.manager]), removeStudent);
// router.get('/student/reviewcv', isAuthenticateUser, authorizeRoles([role.manager]), listStudentReviewCV);

export default router;
