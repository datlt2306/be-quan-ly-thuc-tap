
const { sendRequestToManager } = require('../controllers/requestStudentController');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
  const { role } = require('../utils/role');
  
  const router = require('express').Router();
  
  router.post(
    "/request",
    isAuthenticateUser,
    authorizeRoles([role.student]),
    sendRequestToManager
  );

  router.get(
    "/getRequest",
    isAuthenticateUser,
    authorizeRoles([role.manager]),
    sendRequestToManager
  );
  module.exports = router;
  