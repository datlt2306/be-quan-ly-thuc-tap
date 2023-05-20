const sendMailController = require("../controllers/email.controller");
const { isAuthenticateUser } = require("../middlewares/CheckAuth");

const router = require("express").Router();

// send mail

router.post("/send-mail", isAuthenticateUser, sendMailController.sendMailUser);

export default router;

