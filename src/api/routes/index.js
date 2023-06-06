import authRouter from './auth.route';
import businessRouter from './business.route';
import applyInterRouter from './applyIntern.route';
import campusRouter from './campus.route.js';
import googleDriveRouter from './googleDrive.route';
import majorRouter from './major.route';
import managerRouter from './manager.route';
import myWorkRouter from './myWork.route';
import narrowRouter from './narrow.route';
import notificationRouter from './notification.route';
import reportFormRouter from './reportForm.route';
import requestStudentRouter from './requestStudent.route';
import semesterRouter from './semester.route';
import specializationRouter from './specialization.route';
import statusStudentRouter from './student.route';
import studentRouter from './student.route';
import timeWindowRouter from './timeWindow.route';
import tokenDeviceRouter from './tokenDevice.route';

import express from 'express';

const router = express.Router();

const appRouters = [
	authRouter,
	businessRouter,
	applyInterRouter,
	campusRouter,
	googleDriveRouter,
	majorRouter,
	managerRouter,
	myWorkRouter,
	narrowRouter,
	notificationRouter,
	reportFormRouter,
	requestStudentRouter,
	semesterRouter,
	specializationRouter,
	statusStudentRouter,
	studentRouter,
	timeWindowRouter,
	tokenDeviceRouter
];

appRouters.forEach((route) => router.use(route));

export default router;
