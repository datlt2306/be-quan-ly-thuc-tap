import express from "express";
const router = express.Router();

import {
  insertStudent,
  listStudent,
  listStudentReviewCV,
  readOneStudent,
  removeStudent,
  updateReviewerStudent,
  updateStatusStudent,
  updateStudent,
  readStudentById,
  updateBusinessStudent,
  resetStatusStudent,
} from "../controllers/student";
import { authorizeRoles, isAuthenticateUser } from "../middlewares/CheckAuth";
import student from "../models/student";
import { role } from "../utils/role";
router.get(
  "/student",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  listStudent
);
router.get(
  "/student/reviewcv",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  listStudentReviewCV
);
router.get("/student/:id", isAuthenticateUser, readOneStudent);
router.get("/student/manager/:id", readStudentById);
router.get(
  "/student/reset/:id",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  // checkRequestTime,
  resetStatusStudent
);
router.post(
  "/student",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  insertStudent
);
router.patch(
  "/student",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  updateReviewerStudent
);

router.patch(
  "/student/business",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  updateBusinessStudent
);
router.patch(
  "/student/status",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  updateStatusStudent
);
router.patch(
  "/student/:id",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  updateStudent
);
router.delete(
  "/student/:id",
  isAuthenticateUser,
  authorizeRoles(role.manager),
  removeStudent
);
router.post("/generate-fake-data", () => {
  for (let i = 0; i <= 30; i++) {
    student.create({
      name: "Dương Điệp" + i,
      CV: "61c5d4d60e722e6436118598",
      studentCode: "Ok" + i,
      email: "Còn Hàng",
      address: "Ngô thừa ân",
      internshipIndustry: "Kì 6",
      phoneNumber: 4,
    });
  }
});
module.exports = router;
