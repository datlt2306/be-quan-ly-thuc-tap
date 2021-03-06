import express from "express";
import {
  createManager,
  getListManager,
  removeManager,
  updateManager,
} from "../controllers/manager";
import { authorizeRoles, isAuthenticateUser } from "../middlewares/CheckAuth";
import { role } from "../utils/role";

const router = express.Router();

router.get(
  "/manager",
  isAuthenticateUser,
  authorizeRoles([role.dev, role.manager]),
  getListManager
);

router.post(
  "/manager",
  isAuthenticateUser,
  authorizeRoles([role.dev]),
  createManager
);
router.patch(
  "/manager/:id",
  isAuthenticateUser,
  authorizeRoles([role.dev]),
  updateManager
);
router.delete(
  "/manager/:id",
  isAuthenticateUser,
  authorizeRoles([role.dev]),
  removeManager
);

module.exports = router;
