import {
	getListNotificationByStudentId,
	createNotification,
	removeNotification,
	sendMessage,
	updateSendNoti
} from '../controllers/notification.controller';
import express from 'express';

const router = express.Router();

router.get('/notifications/:student_id', getListNotificationByStudentId);
router.post('/send-message', sendMessage);
router.post('/notification', createNotification);
router.put('/notification-send/:id', updateSendNoti);
router.delete('/token', removeNotification);

export default router;
