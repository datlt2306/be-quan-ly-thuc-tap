const {
  getSemester,
  insertSemester,
  updateSemester,
  getDefaultSemester,
} = require("../controllers/semester.controller");
const {
  isAuthenticateUser,
  authorizeRoles,
} = require("../middlewares/CheckAuth");
const { role } = require("../../utils/role");

const router = require("express").Router();

router.get(
  "/smester",
  getSemester
);
router.post(
  "/add-mester",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  insertSemester
);
router.patch(
  "/update-mester/:id",
  isAuthenticateUser,
  authorizeRoles([role.manager]),
  updateSemester
);
router.get(
  "/smester/default",
  getDefaultSemester
);
module.exports = router;
