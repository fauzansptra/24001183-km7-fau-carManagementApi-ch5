const router = require("express").Router();

const { carController } = require("../controllers");
const authenticate = require("../middlewares/authenticate");

router.post("", authenticate, carController.createCar);
router.get("", carController.getAllCar);
router.get("/:id", carController.getCarById);
router.patch("/:id", authenticate, carController.updateCar);
router.delete("/:id", authenticate, carController.deleteCar);

module.exports = router;
