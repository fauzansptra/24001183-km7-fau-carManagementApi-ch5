const router = require("express").Router();

const Car = require("./carRouter");
const Auth = require("./authRouter");
const User = require("./userRouter");

// const Product = require("./productRouter");
// const Shop = require("./shopRouter");
// const Auth = require("./authRouter");

router.use("/cars", Car);
router.use("/auth", Auth);
router.use("/users", User);

// router.use("/products", Product);
// router.use("/shops", Shop);
// router.use("/auth", Auth);

module.exports = router;
