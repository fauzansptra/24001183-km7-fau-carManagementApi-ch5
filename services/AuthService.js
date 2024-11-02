const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthRepository } = require("../repositories");
const { UserRepository } = require("../repositories");

class AuthService {
  async register(userData) {
    const { name, age, address, email, password } = userData;

    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser({ name, age, address });
    const newAuth = await AuthRepository.createAuth({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    return {
      userName: newUser.name,
      email: newAuth.email,
    };
  }

  async login({ email, password }) {
    const data = await AuthRepository.findByEmail(email);
    if (!data) {
      throw new Error("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) {
      throw new Error("Wrong Password");
    }

    const token = jwt.sign(
      {
        id: data.id,
        userName: data.user.name,
        email: data.email,
        userId: data.user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRED || "1h" }
    );

    return {
      userName: data.user.name,
      token,
    };
  }
}

module.exports = new AuthService();
