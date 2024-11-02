// userService.js
const bcrypt = require("bcrypt");
const { UserRepository } = require("../repositories");

const getUserById = async (id) => {
  const user = await UserRepository.findUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};

const registerUser = async (userData) => {
  const { email, password, ...otherData } = userData;
  const existingUser = await UserRepository.findUserByEmail(email);
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserRepository.createUser(otherData);
  await UserRepository.createAuth({
    email,
    password: hashedPassword,
    userId: user.id,
  });
  return user;
};

const findAllUsers = async (query) => {
  const { page = 1, limit = 10, ...filters } = query;
  const condition = buildFilterCondition(filters);
  const options = { limit, offset: (page - 1) * limit };

  const users = await UserRepository.findUsers(condition, options);
  return {
    totalData: users.count,
    totalPages: Math.ceil(users.count / limit),
    currentPage: page,
    users: users.rows,
  };
};

const updateUser = async (id, data) => {
  const [updated] = await UserRepository.updateUser(id, data);
  if (!updated) throw new Error("User not found");
};

const deleteUser = async (id) => {
  const user = await UserRepository.findUserById(id);
  if (!user) throw new Error("User not found");
  await UserRepository.deleteUser(id);
};

const buildFilterCondition = (filters) => {
  const condition = {};
  if (filters.name) condition.name = { [Op.iLike]: `%${filters.name}%` };
  if (filters.age) condition.age = filters.age;
  if (filters.address)
    condition.address = { [Op.iLike]: `%${filters.address}%` };
  if (filters.role) condition.role = filters.role;
  return condition;
};

module.exports = {
  getUserById,
  registerUser,
  findAllUsers,
  updateUser,
  deleteUser,
};
