const { getListNotificationByStudentId, createNotification, removeNotification, sendMessage, updateSendNoti } = require('../controllers/notification.controller');

  
  const router = require('express').Router();
  
  router.get('/notifications/:student_id', getListNotificationByStudentId);
  router.post('/send-message', sendMessage)
  router.post('/notification', createNotification);
  router.put('/notification-send/:id', updateSendNoti);
  router.delete('/token', removeNotification);
  module.exports = router;