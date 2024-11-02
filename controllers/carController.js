const { Car } = require("../models");
const { Op } = require("sequelize");

const createCar = async (req, res) => {
  const { brand, model, year } = req.body;
  const user = req.user;

  try {
    const newCar = await Car.create({
      brand,
      model,
      year,
      createdBy: user.id,
    });

    res.status(201).json({
      status: "Success",
      message: "Successfully created a new car",
      isSuccess: true,
      data: {
        newCar,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    } else if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({
        status: "Failed",
        message: error.message || "Database error",
        isSuccess: false,
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "Failed",
        message: error.message,
        isSuccess: false,
        data: null,
      });
    }
  }
};

const getAllCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      page = 1,
      limit = 10,
      sortBy = "brand",
      order = "ASC",
    } = req.query;

    const validSortFields = ["brand", "model", "year"];
    const validOrders = ["ASC", "DESC"];

    if (
      !validSortFields.includes(sortBy) ||
      !validOrders.includes(order.toUpperCase())
    ) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid sortBy or order parameter",
        isSuccess: false,
        data: null,
      });
    }

    const carCondition = {};
    if (brand) carCondition.brand = { [Op.iLike]: `%${brand}%` };
    if (model) carCondition.model = { [Op.iLike]: `%${model}%` };

    const offset = (page - 1) * limit;

    const cars = await Car.findAndCountAll({
      where: carCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order.toUpperCase()]],
    });

    const totalData = cars.count;
    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      status: "Success",
      message: "Cars fetched successfully",
      isSuccess: true,
      data: {
        totalData,
        totalPages,
        currentPage: parseInt(page),
        cars: cars.rows,
      },
    });
  } catch (error) {
    console.error(error.stack);

    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((error) => error.message);
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
const getDeletedCars = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const carCondition = {
      deletedAt: { [Op.ne]: null },
    };

    const offset = (page - 1) * limit;

    const cars = await Car.findAndCountAll({
      where: carCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      paranoid: false,
    });

    const totalData = cars.count;
    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      status: "Success",
      message: "Soft-deleted cars fetched successfully",
      isSuccess: true,
      data: {
        totalData,
        totalPages,
        currentPage: parseInt(page),
        cars: cars.rows,
      },
    });
  } catch (error) {
    console.error(error.stack);

    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((error) => error.message);
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

const getCarById = async (req, res) => {
  const id = req.params.id;

  try {
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Car not found",
        isSuccess: false,
        data: null,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved car data",
      isSuccess: true,
      data: {
        car,
      },
    });
  } catch (error) {
    console.error(error.stack);

    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((error) => error.message);
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

const updateCar = async (req, res) => {
  const id = req.params.id;
  const { brand, model, year } = req.body;
  const user = req.user;

  try {
    const car = await Car.findOne({
      where: { id },
    });

    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Car not found",
        isSuccess: false,
        data: null,
      });
    }

    await Car.update(
      {
        brand,
        model,
        year,
        updatedBy: user.id,
      },
      {
        where: { id },
      }
    );

    const updatedCar = await Car.findOne({ where: { id } });

    res.status(200).json({
      status: "Success",
      message: "Successfully updated car",
      isSuccess: true,
      data: {
        car: updatedCar,
      },
    });
  } catch (error) {
    console.error(error.stack);

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

const deleteCar = async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  try {
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Car not found",
        isSuccess: false,
        data: null,
      });
    }

    await Car.update({ deletedBy: user.id }, { where: { id } });

    await Car.destroy({
      where: { id },
    });

    res.status(200).json({
      status: "Success",
      message: "Successfully deleted car",
      isSuccess: true,
      data: null,
    });
  } catch (error) {
    console.error(error.stack);

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
  createCar,
  getAllCar,
  getDeletedCars,
  getCarById,
  updateCar,
  deleteCar,
};
