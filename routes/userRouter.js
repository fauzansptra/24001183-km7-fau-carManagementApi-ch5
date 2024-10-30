const router = require("express").Router();

const userController = require("../controllers/userController");

// router.post("", userController.cre);
router.get("", userController.findUsers);
router.get("/:id", userController.findUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
