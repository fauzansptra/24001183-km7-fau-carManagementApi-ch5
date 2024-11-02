// controllers/AuthController.js
const { AuthService } = require("../services");

const register = async (req, res) => {
  try {
    const userData = req.body;
    const result = await AuthService.register(userData);

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      data: null,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    res.status(200).json({
      status: "Success",
      message: "Success login",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
};
