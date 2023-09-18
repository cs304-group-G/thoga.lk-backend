import User from "../models/user.model";
import generatePassword from "../utils/generatePassword";

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
        password: hashedPassword,
        phone: phone,
        role: "pending",
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
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

module.exports = { register };
