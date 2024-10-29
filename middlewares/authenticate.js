const jwt = require("jsonwebtoken");
const { User } = require("../models");
module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
    if (!bearerToken) {
      return res.status(401).json({
        status: "failed",
        message: "Token is missing",
        isSucces: false,
        data: null,
      });
    }
    const token = bearerToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (user.role === "admin" || user.role === "superadmin") {
      req.user = user;
      next();
    } else {
      return res.status(401).json({
        status: "failed",
        message: "Lu bukan admin",
        isSucces: false,
        data: null,
      });
    }
    // if (bearerToken) {
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "You are not authorized",
    //     isSucces: false,
    //     data: null,
    //   });
    // }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
      isSucces: false,
      data: null,
    });
  }
};
