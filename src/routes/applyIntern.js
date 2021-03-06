import express from "express";
import { signUpCVForSupport } from "../controllers/applyInternController";
import { isAuthenticateUser } from "../middlewares/CheckAuth";
import { checkRequestTime } from "../middlewares/CheckTimeRequest";

const router = express.Router();

router.patch(
  "/intern/support",
  isAuthenticateUser,
  checkRequestTime,
  signUpCVForSupport
);

module.exports = router;
