const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../Errors/BadRequestError");
const ForbiddenError = require("../Errors/ForbiddenError");
const NotFoundError = require("../Errors/NotFoundError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send(item);
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data received."));
      } else {
        next(e);
      }
    });
};

const getItem = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

const deleteItem = (req, res, next) => {
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
          .catch(next);
      } else {
        next(new ForbiddenError("Cannot delete items created by other users"));
      }
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find item with requested Id"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

const likeItem = (req, res, next) => {
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
        next(new NotFoundError("Cannot find item with requested Id"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

const unlikeItem = (req, res, next) => {
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
        next(new NotFoundError("Cannot find item with requested Id"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
