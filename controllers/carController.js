const { Car } = require("../models");
const { Op } = require("sequelize");

const createCar = async (req, res) => {
  const { brand, model, year } = req.body;
  const user = req.user;
  console.log(user);
  try {
    const newCar = await Car.create({
      brand,
      model,
      year,
      createdBy: user.id,
    });

    res.status(201).json({
      status: "Success",
      message: "Success create new product",
      isSuccess: true,
      data: {
        newCar,
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

    const carCondition = {};
    if (brand) carCondition.brand = { [Op.iLike]: `%${brand}%` };
    if (model) carCondition.model = { [Op.iLike]: `%${model}%` };

    const offset = (page - 1) * limit;
    // const car = await Cars.findAll();
    console.log(Car);

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
      message: "cars fetched successfully",
      isSuccess: true,
      data: {
        totalData,
        totalPages,
        currentPage: parseInt(page),
        cars: cars.rows,
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

const getCarById = async (req, res) => {
  const id = req.params.id;

  try {
    const cars = await Car.findOne({
      where: {
        id,
      },
      // include: [
      //   {
      //     model: Shops,
      //     as: "shop",
      //   },
      // ],
    });

    res.status(200).json({
      status: "Success",
      message: "Success get cars data",
      isSuccess: true,
      data: {
        cars,
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

const updateCar = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { brand, model, year } = req.body;
  const user = req.user;

  try {
    // Find the car first
    const car = await Car.findOne({
      where: { id },
    });

    // If the car doesn't exist, return a 404
    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Data not found",
        isSuccess: false,
        data: null,
      });
    }

    // Update the car record, specifying the condition for the update
    await Car.update(
      {
        brand,
        model,
        year,
        updatedBy: user.id,
      },
      {
        where: { id }, // Specify the condition to find the right record
      }
    );

    // Optionally retrieve the updated car record
    const updatedCar = await Car.findOne({ where: { id } });

    res.status(200).json({
      status: "Success",
      message: "Success update car",
      isSuccess: true,
      data: {
        car: updatedCar, // Return the updated car object
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

const deleteCar = async (req, res) => {
  const id = req.params.id;
  const user = req.user; // The authenticated user

  try {
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Data not found",
        isSuccess: false,
        data: null,
      });
    }

    // Soft delete the car and set deletedBy
    await Car.update(
      { deletedBy: user.id }, // Record who deleted
      { where: { id } }
    );

    // The soft delete action is automatic with paranoid: true
    await Car.destroy({
      where: { id },
    });

    res.status(200).json({
      status: "Success",
      message: "Success delete product",
      isSuccess: true,
      data: null,
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
  createCar,
  getAllCar,
  getCarById,
  updateCar,
  deleteCar,
};
