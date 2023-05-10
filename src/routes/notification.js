const {
	getListNotificationByStudentId,
	createNotification,
	removeNotification,
	sendMessage,
	updateSendNoti,
} = require('../controllers/notification');

const router = require('express').Router();

router.get('/notification/:id', getListNotificationByStudentId);
router.post('/notification/message', sendMessage);
router.post('/notification', createNotification);
router.put('/notification/:id', updateSendNoti);
router.delete('/notification/:id', removeNotification);
module.exports = router;
