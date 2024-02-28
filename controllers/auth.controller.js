const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//Models
const User = require("../models/User");
const { createToken } = require("../middleware/jwt.middleware");

const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "User not found!" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ error: "Incorrect password!" });
      } else {
        const token = createToken(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          "30d"
        );
        res.status(200).json({
          token,
          user: {
            name: user.name,
            email: user.email,
          },
          message: "Login Successfull!",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

const signup = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      res
        .status(400)
        .json({ error: "This email is already registered, please login!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await new User({
        name: name,
        email: email,
        password: hashedPassword,
        todos: [],
      }).save();

      const token = createToken(
        {
          _id: newUser._id,
          name: name,
          email: email,
        },
        "30d"
      );

      return res.status(200).json({
        token,
        user: { name: name, email: email },
        message: "Signup Successfull!",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

module.exports = { login, signup };
