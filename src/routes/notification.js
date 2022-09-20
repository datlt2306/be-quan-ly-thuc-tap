const { getListNotificationByStudentId, createNotification, removeNotification, sendMessage } = require('../controllers/notification');

  
  const router = require('express').Router();
  
  router.get('/notifications/:student_id', getListNotificationByStudentId);
  router.post('/send-message', sendMessage)
  router.post('/notification', createNotification);
  router.delete('/token', removeNotification);
  module.exports = router;