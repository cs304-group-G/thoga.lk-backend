import User from "../models/user.model.js";
import { generatePassword } from "../utils/generatePassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// POST: {BASE_URL}/auth/register
const register = async (req, res) => {
  const { name, email, phone } = req.body;
  const password = generatePassword();

  // TODO: setup sms and remove console log
  console.log(password);

  bcrypt
    .hash(password, 10)
    .then(async (hashedPassword) => {
      // creating user object
      const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: "USER",
        isVerified: false,
      });

      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error: error.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Password was not hashed successfully",
        err,
      });
    });
};


// POST: {BASE_URL}/auth/login
const login = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;

  const token = jwt.sign(
    {
      email: req.user.email,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );

  if (req.user.role == "ADMIN" || req.user.role == "USER") {
    const resObject = {
      token: token,
      role: req.user.role,
    };
    return res.status(200).send(resObject);
  } else if (req.user.role == "pending") {
    return res.status(200).send({
      message:
        "Please note that the user account has not been confirmed yet. you need to login with given credentials and reset password to confirm account",
      token: token,
      role: req.user.role,
    });
  } else {
    return res.status(200).json({
      message:
        "Prior registration is required before accessing Meeting Management System",
    });
  }
};

// GET: {BASE_URL}/auth/user
const getUserData = async (req, res) => {
  User.findOne({ email: req.user.email })
    .then((user) => {
      const userData = {
        userID: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
      res.status(200).json({ userData: userData });
    })
    .catch((err) => {
      res.status(200).json({ message: "user data not found" });
    });
};

export { register, login, getUserData };
