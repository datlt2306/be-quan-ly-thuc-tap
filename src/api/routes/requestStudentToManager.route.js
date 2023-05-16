
const { sendRequestToManager, getRequestOfStudent, resetStudent, cancelResetStudent } = require('../controllers/requestStudent.controller');
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/CheckAuth');
  const { role } = require('../../utils/role');
  
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
    getRequestOfStudent
  );

  router.patch(
    "/resetStudent/:id",
    isAuthenticateUser,
    authorizeRoles([role.manager]),
    resetStudent
  );

  router.patch(
    "/removeRequest/:id",
    isAuthenticateUser,
    authorizeRoles([role.manager]),
    cancelResetStudent
  )
  module.exports = router;
  