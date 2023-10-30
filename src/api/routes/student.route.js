import express from 'express';
import multer from 'multer';
import { role } from '../../utils/role';
import {
	getStudentsToReview,
	importStudents,
	listStudent,
	readOneStudent,
	updateBusinessStudent,
	updateReviewerStudent,
	updateStatusStudent,
	updateStudent
} from '../controllers/student.controller';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/CheckAuth';

const upload = multer({ dest: 'tmp/', limits: { fileSize: 8000000 } });

const router = express.Router();

router.get('/student/reviews', isAuthenticateUser, authorizeRoles([role.staff]), getStudentsToReview);
router.get('/student', isAuthenticateUser, authorizeRoles([role.staff]), listStudent);
router.get('/student/:id', isAuthenticateUser, readOneStudent);
router.post('/student', isAuthenticateUser, authorizeRoles([role.staff]), upload.single('file'), importStudents);
router.patch('/student', isAuthenticateUser, authorizeRoles([role.staff]), updateReviewerStudent);
router.patch('/student/business', isAuthenticateUser, authorizeRoles([role.staff]), updateBusinessStudent);
router.patch('/student/status', isAuthenticateUser, authorizeRoles([role.staff]), updateStatusStudent);
router.patch('/student/:id', isAuthenticateUser, authorizeRoles([role.staff]), updateStudent);

export default router;
