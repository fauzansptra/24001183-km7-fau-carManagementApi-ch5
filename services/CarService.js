const { CarRepository } = require("../repositories");

class CarService {
  async createCar(carData, userId) {
    return await CarRepository.create({ ...carData, createdBy: userId });
  }

  async getAllCars(query) {
    const {
      brand,
      model,
      year,
      page = 1,
      limit = 10,
      sortBy = "brand",
      order = "ASC",
    } = query;

    const offset = (page - 1) * limit;

    return await CarRepository.findAll({
      brand,
      model,
      year,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      order: order.toUpperCase(),
    });
  }

  async getCarById(id) {
    const car = await CarRepository.findById(id);
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  }

  async updateCar(id, carData, userId) {
    await this.getCarById(id);
    return await CarRepository.update(id, { ...carData, updatedBy: userId });
  }

  async deleteCar(id, userId) {
    const car = await this.getCarById(id);
    await CarRepository.update(id, { deletedBy: userId });
    return await CarRepository.delete(id);
  }
}

module.exports = new CarService();
