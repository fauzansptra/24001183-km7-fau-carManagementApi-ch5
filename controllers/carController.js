const { CarService } = require("../services");

const createCar = async (req, res) => {
  try {
    const newCar = await CarService.createCar(req.body, req.user.id);
    res.status(201).json({
      status: "Success",
      message: "Successfully created a new car",
      isSuccess: true,
      data: { newCar },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const getAllCar = async (req, res) => {
  try {
    const cars = await CarService.getAllCars(req.query);
    const totalData = cars.count;
    const totalPages = Math.ceil(totalData / req.query.limit);

    res.status(200).json({
      status: "Success",
      message: "Cars fetched successfully",
      isSuccess: true,
      data: {
        totalData,
        totalPages,
        currentPage: parseInt(req.query.page || 1),
        cars: cars.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await CarService.getCarById(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved car data",
      isSuccess: true,
      data: { car },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const updatedCar = await CarService.updateCar(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json({
      status: "Success",
      message: "Successfully updated car",
      isSuccess: true,
      data: { car: updatedCar },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    await CarService.deleteCar(req.params.id, req.user.id);
    res.status(200).json({
      status: "Success",
      message: "Successfully deleted car",
      isSuccess: true,
      data: null,
    });
  } catch (error) {
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
