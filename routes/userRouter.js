const router = require("express").Router();

const authenticate = require("../middlewares/authenticate");
const { userController } = require("../controllers");

router.post("", authenticate(["superadmin"]), userController.createAdmin);
router.get("", authenticate(["admin", "superadmin"]), userController.findUsers);
router.get(
  "/current-user",
  authenticate(["admin", "superadmin", "member"]),
  userController.getCurrentUser
);
router.get(
  "/:id",
  authenticate(["admin", "superadmin"]),
  userController.findUserById
);
router.patch(
  "/:id",
  authenticate(["admin", "superadmin"]),
  userController.updateUser
);
router.delete(
  "/:id",
  authenticate(["admin", "superadmin"]),
  userController.deleteUser
);

module.exports = router;
