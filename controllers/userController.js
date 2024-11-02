// userController.js
const { UserService } = require("../services");

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ status: "Failed", message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: { userName: user.name, email: req.body.email },
    });
  } catch (error) {
    res
      .status(error.message === "Email already exists" ? 400 : 500)
      .json({ status: "Failed", message: error.message });
  }
};

const findUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ status: "Failed", message: error.message });
  }
};

const findAllUsers = async (req, res) => {
  try {
    const users = await UserService.findAllUsers(req.query);
    res.status(200).json({
      status: "Success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    await UserService.updateUser(req.params.id, req.body);
    res
      .status(200)
      .json({ status: "Success", message: "User updated successfully" });
  } catch (error) {
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ status: "Failed", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res
      .status(200)
      .json({ status: "Success", message: "User deleted successfully" });
  } catch (error) {
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ status: "Failed", message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  registerUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};
