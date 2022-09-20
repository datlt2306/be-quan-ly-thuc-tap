const { getListToken, getTokenByStudentId, updateTokenDevice, createToken, removeTokenDevice } = require('../controllers/tokenDevice');
  
  const router = require('express').Router();
  
  router.get('/tokens', getListToken);
  router.get('/tokens/:student_id',getTokenByStudentId);
  router.post('/token',createToken);
  router.put('/tokens/:id',updateTokenDevice);
  router.delete('/token', removeTokenDevice);
  module.exports = router;