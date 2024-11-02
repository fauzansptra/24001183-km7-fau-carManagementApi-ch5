const { Car } = require("../models");
const { Op } = require("sequelize");

class CarRepository {
  async create(data) {
    return await Car.create(data);
  }

  async findAll({ brand, model, year, limit, offset, sortBy, order }) {
    const carCondition = {};
    if (brand) carCondition.brand = { [Op.iLike]: `%${brand}%` };
    if (model) carCondition.model = { [Op.iLike]: `%${model}%` };

    return await Car.findAndCountAll({
      where: carCondition,
      limit,
      offset,
      order: [[sortBy, order]],
    });
  }

  async findById(id) {
    return await Car.findOne({ where: { id } });
  }

  async update(id, data) {
    await Car.update(data, { where: { id } });
    return await Car.findOne({ where: { id } });
  }

  async delete(id) {
    return await Car.destroy({ where: { id } });
  }
}

module.exports = new CarRepository();
