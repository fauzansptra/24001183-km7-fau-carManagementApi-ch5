const { Auth } = require("../models");

class AuthRepository {
  async findByEmail(email) {
    return await Auth.findOne({ where: { email } });
  }

  async createAuth(data) {
    return await Auth.create(data);
  }
}

module.exports = new AuthRepository();
