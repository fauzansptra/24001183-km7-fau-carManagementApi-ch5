const router = require("express").Router();

const { carController } = require("../controllers");
const authenticate = require("../middlewares/authenticate");

router.post("", authenticate(["admin", "superadmin"]), carController.createCar);
router.get("", carController.getAllCar);
router.get(
  "/soft-deleted",
  authenticate(["admin", "superadmin"]),
  carController.getDeletedCars
);
router.get("/:id", carController.getCarById);

router.patch(
  "/:id",
  authenticate(["admin", "superadmin"]),
  carController.updateCar
);
router.delete(
  "/:id",
  authenticate(["admin", "superadmin"]),
  carController.deleteCar
);

module.exports = router;
