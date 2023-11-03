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

// POST: {BASE_URL}/auth/authenticate
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

// GET: {BASE_URL}/auth/userdata
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

// POST: {BASE_URL}/auth/password-update
// use same route to verify account
// all new accounts need to update password to complete varification
const updatePassword = async (req, res) => {
  bcrypt
    .hash(req.body.newPassword, 10)
    .then((hashedPassword) => {
      // creating user object
      const user = {
        email: req.user.email,
      };

      const update = {
        password: hashedPassword,
        isVerified: true,
      };

      req.user.role == "admin"
        ? (update.role = "admin")
        : (update.role = "collector");

      // saving user data to database
      User.findOneAndUpdate(user, update, { new: true })
        .then((result) => {
          if (!result) {
            res.status(400).send({
              message: "user Registration failed",
            });
          } else {
            res.status(201).send({
              message: "User Registerd Successfully",
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: error.message,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        error: e.message,
      });
    });
};

// POST: {BASE_URL}/auth/password-force-reset
// reset password by otp confirmation, need to login first
const passwordForceReset = async (req, res) => {
  const password = generatePassword();
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        password: hashedPassword,
        isVerified: false,
      };

      User.findOneAndUpdate(user, update)
        .then(async (result) => {
          if (!result) {
            res.status(500).send({
              message: "user password reset failed",
            });
          } else {
            // TODO: send new generated password to phone or email
            console.log("OTP : " + password);

            res.status(201).send({
              message: "User Password reset Successfull",
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error resetting password",
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

// POST: {BASE_URL}/auth/forget-password-request
// request password reset OTP
const forgetPasswordRequest = async (req, res) => {
  const tempPassword = generatePassword();
  bcrypt
    .hash(tempPassword, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        tempPassword: hashedPassword,
      };

      User.findOneAndUpdate(user, update)
        .then(async (result) => {
          if (!result) {
            res.status(500).send({
              message: "user with given email not found",
            });
          } else {
            User.findOne(user)
              .then(async (user) => {
                // TODO: send OTP (temp password)
                console.log("OTP : " + tempPassword);
              })
              .catch((err) => {
                res.status(400).json({ message: err.message });
              });

            res.status(201).send({
              message: "User Password reset Successfull",
              result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({
            message: "Error resetting password",
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

// {BASE_URL}/auth/forget-password-reset
// reset password by OTP confirmation
const forgetPasswordReset = async (req, res) => {
  const { tempPassword, email, newPassword } = req.body;

  User.findOne({ email: email })
    .then(async (user) => {
      const isMatch = await bcrypt.compare(tempPassword, user.tempPassword);

      if (isMatch) {
        bcrypt
          .hash(newPassword, 10)
          .then((hashedPassword) => {
            const user = {
              email: req.body.email,
            };

            const update = {
              password: hashedPassword,
              tempPassword: undefined,
            };

            User.findOneAndUpdate(user, update)
              .then((result) => {
                res.status(201).send({
                  message: "User Password reset Successfull",
                });
              })
              .catch((error) => {
                res.status(500).send({
                  message: "Error resetting password",
                });
              });
          })
          .catch((e) => {
            res.status(500).send({
              message: "Password was not hashed successfully",
              e,
            });
          });
      } else {
        res.status(400).json({ message: "temp passpord does not match" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "user with given email not found" });
    });
};

export {
  register,
  login,
  getUserData,
  updatePassword,
  passwordForceReset,
  forgetPasswordRequest,
  forgetPasswordReset,
};
