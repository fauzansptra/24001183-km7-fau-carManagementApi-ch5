const jwt = require("jsonwebtoken");
const { Auth, User } = require("../models");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { name, age, address, email, password } = req.body;

    // Check if user with this email already exists
    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "Email already exists",
        data: null,
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user in the User table
    const newUser = await User.create({ name, age, address });

    // Create auth record in Auth table with a reference to the new user
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id, // assuming `Auth` model has a `userId` field that references the `User` model
    });

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: {
        username: newUser.name,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
      data: null,
    });
  }
};

const login = async (req, res, next) => {
  // console.log("masuk ga ke login");
  try {
    const { email, password } = req.body;

    // const emailUser=await

    const data = await Auth.findOne({
      include: [{ model: User, as: "user" }],
      where: {
        email,
      },
    });

    console.log(data);

    if (!data) {
      return res.status(404).json({
        status: "Failed",
        message: "User does not exist",
        // data: token,
        isSucces: "false",
        data: null,
      });
    }

    if (data && bcrypt.compareSync(password, data.password)) {
      const token = jwt.sign(
        {
          id: data.id,
          username: data.user.name,
          email: data.email,
          userId: data.user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRED }
      );
      res.status(200).json({
        status: "Success",
        message: "Success login",
        isSucces: true,
        data: { username: data.user.name, token },
        // data: { token },
      });
    } else {
      res.status(401).json({
        status: "Failed",
        message: "Wrong Password",
        isSucces: false,
        // data: { username: data.user.name, token },
      });
    }
  } catch (err) {
    // console.log("error coy"),
    res.status(500).json({
      status: "Success",
      message: err.message,
      data: null,
    });
  }
};

const authenticate = async (req, res) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {}
};

module.exports = {
  register,
  login,
  authenticate,
};
