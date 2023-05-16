import express from "express";
import {
  createSpecialization,
  getListSpecialization,
} from "../controllers/specialization.controller";
import { authorizeRoles, isAuthenticateUser } from "../middlewares/CheckAuth";
const router = express.Router();

router.post(
  "/specialization",
  isAuthenticateUser,
  authorizeRoles([1, 2]),
  createSpecialization
);
router.get(
  "/specialization",
  isAuthenticateUser,
  authorizeRoles([1, 2]),
  getListSpecialization
);

module.exports = router;
