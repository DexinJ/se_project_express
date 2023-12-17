const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../Errors/BadRequestError");
const { ForbiddenError } = require("../Errors/ForbiddenError");
const { NotFoundError } = require("../Errors/NotFoundError");
const { AuthorizationError } = require("../Errors/AuthorizationError");
const { ConflictError } = require("../Errors/ConfilctError");

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
              next(new BadRequestError("Validation Failed!"));
            } else {
              next(e);
            }
          });
      }
    })
    .catch((e) => {
      next(e);
    });
};

const login = (req, res) => {
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
          next(new AuthorizationError("Incorrect email or password"));
        } else {
          next(e);
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
        next(new NotFoundError("Cannot find user"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
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
        next(new BadRequestError("Validation Failed!"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find user"));
      } else {
        next(e);
      }
    });
};
module.exports = { createUser, login, getCurrentUser, updateProfile };
