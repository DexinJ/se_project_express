const Users = require("../models/user");
const { NOT_FOUND, BAD_REQUEST, DEFAULT_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." }),
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find user with requested Id",
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

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  Users.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
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
};
module.exports = { getUsers, getUser, createUser };
