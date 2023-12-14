const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  DEFAULT_ERROR,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send(item);
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

const getItem = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const owner = req.user._id;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(owner)) {
        clothingItem
          .findByIdAndDelete(itemId)
          .then((i) => {
            res.send({ data: i });
          })
          .catch(() => {
            res.status(DEFAULT_ERROR).send({
              message: "An error has occurred on the server.",
            });
          });
      } else {
        res
          .status(FORBIDDEN)
          .send({ message: "Cannot delete items created by other users" });
      }
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find item with requested Id",
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

const likeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((like) => res.send(like))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find item with requested Id",
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

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((like) => res.send(like))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message: "Cannot find item with requested Id",
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

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
