const { User, Auth } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
const findUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
        isSuccess: false,
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
    });
  }
};
const findUsers = async (req, res) => {
  try {
    const {
      name,
      age,
      address,
      role,
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "ASC",
    } = req.query;

    const userCondition = {};
    if (name) userCondition.name = { [Op.iLike]: `%${name}%` };
    if (age) userCondition.age = age;
    if (address) userCondition.address = { [Op.iLike]: `%${address}%` };
    if (role) userCondition.role = role;

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: userCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ["id", "name", "age", "address", "role"],
    });

    const totalData = users.count;
    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      status: "Success",
      message: "Users fetched successfully",
      isSuccess: true,
      data: {
        totalData,
        totalPages,
        currentPage: parseInt(page),
        users: users.rows,
      },
    });
  } catch (error) {
    console.log(error.name);

    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const updateUser = async (req, res) => {
  const { name, age, role, address } = req.body;
  try {
    const [updated] = await User.update(
      { name, age, role, address },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updated) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
        isSuccess: false,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "User updated successfully",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
        isSuccess: false,
      });
    }

    await Auth.destroy({
      where: { userId: userId },
    });

    await User.destroy({
      where: { id: userId },
    });

    res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
      isSuccess: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, age, address, email, password } = req.body;

    const existingAuth = await Auth.findOne({ where: { email } });
    if (existingAuth) {
      return res.status(400).json({
        status: "Failed",
        message: "Email already exists",
        data: null,
      });
    }

    if (!password || password.length < 6 || password.length > 100) {
      return res.status(400).json({
        status: "Failed",
        message: "Password must be between 6 and 100 characters long",
        data: null,
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      age,
      address,
      role: "admin",
    });

    const auth = await Auth.create({
      email,
      password: hashedPassword,
      userId: user.id,
    });

    res.status(201).json({
      status: "Success",
      message: "Admin created successfully",
      data: {
        id: user.id,
        name: user.name,
        email: auth.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getCurrentUser,
};
