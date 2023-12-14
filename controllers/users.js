const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const {
  NOT_FOUND,
  BAD_REQUEST,
  DEFAULT_ERROR,
  AUTHORIZATION_ERROR,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(CONFLICT).send({ message: "Email already used!" });
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => Users.create({ name, avatar, email, password: hash }))
          .then((newUser) => {
            res.send({
              data: {
                name: newUser.name,
                avatar: newUser.avatar,
                email: newUser.email,
              },
            });
          })
          .catch((e) => {
            if (e.name === "ValidationError") {
              res.status(BAD_REQUEST).send({
                message: "Validation Failed!",
              });
            } else {
              res
                .status(DEFAULT_ERROR)
                .send({ message: "An error has occurred on the server." });
            }
          });
      }
    })
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  console.log("request to signin received");
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(AUTHORIZATION_ERROR)
      .send({ message: "Incorrect email or password" });
  } else {
    Users.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token: token, avatar: user.avatar, name: user.name });
      })
      .catch((e) => {
        if (e.message === "Incorrect email or password") {
          res
            .status(AUTHORIZATION_ERROR)
            .send({ message: "Incorrect email or password" });
        } else {
          res
            .status(DEFAULT_ERROR)
            .send({ message: "An error has occurred on the server." });
        }
      });
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find user",
        });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid Id.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({
          message: "An error has occurred on the server.",
        });
      }
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  Users.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Validation Failed!",
        });
      } else if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find user",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
module.exports = { createUser, login, getCurrentUser, updateProfile };
