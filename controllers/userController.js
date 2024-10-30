const { User } = require("../models");
const { Op } = require("sequelize");

const findUsers = async (req, res, next) => {
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
      // order: [[sortBy, order.toUpperCase()]],
      attributes: ["id", "name", "age", "address", "role"],
    });

    const totalData = users.count;
    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      status: "Success",
      message: "User fetched successfully",
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

module.exports = {
  findUsers,
};

const findUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {}
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address } = req.body;
  try {
    await User.update(
      {
        name,
        age,
        role,
        address,
        // shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) {}
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) {}
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
