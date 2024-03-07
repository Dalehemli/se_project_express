const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err); // Pass other errors to the error handling middleware
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err)); // Pass errors to the error handling middleware
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item",
        );
      }
      res
        .status(200)
        .send({ message: `The item has been successfully deleted.` });
    })
    .catch((err) => next(err)); // Pass errors to the error handling middleware
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).json(updatedItem);
    })
    .catch((err) => next(err)); // Pass errors to the error handling middleware
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send({ data: item });
    })
    .catch((err) => next(err)); // Pass errors to the error handling middleware
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findOneAndUpdate(
    { _id: itemId },
    { $set: { imageUrl } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send({ data: item });
    })
    .catch((err) => next(err)); // Pass errors to the error handling middleware
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
  updateItem,
};
