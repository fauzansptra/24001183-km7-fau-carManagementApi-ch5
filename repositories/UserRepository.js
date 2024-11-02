// userRepository.js
const { User, Auth } = require("../models");

const findUserById = (id) => User.findByPk(id);
const findUserByEmail = (email) => Auth.findOne({ where: { email } });
const createUser = (userData) => User.create(userData);
const createAuth = (authData) => Auth.create(authData);
const updateUser = (id, data) => User.update(data, { where: { id } });
const deleteUser = (id) => User.destroy({ where: { id } });
const findUsers = (condition, options) =>
  User.findAndCountAll({ where: condition, ...options });

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  createAuth,
  updateUser,
  deleteUser,
  findUsers,
};
