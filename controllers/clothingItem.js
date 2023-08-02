const ClothingItem = require("../models/clothingItem");
const {
  ERROR_CODES,
  handleFailError,
  handleCatchError,
} = require("../utils/errors");

// function handleFindByIdItemError(req, res, err) {
//   if (err.name === "CastError" || err.name === "ValidationError") {
//     return res.status(ERROR_400).send({
//       message:
//         "Creating item received invalid data, or invalid ID passed to params",
//     });
//   }
//   if (err.name === "DocumentNotFoundError") {
//     return res.status(ERROR_404).send({
//       message: "Clothing ID does not exist, or request was invalid",
//     });
//   }
//   return res.status(ERROR_500).send({ message: "An error has occured" });
// }

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleCatchError(req, res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      handleCatchError(req, res, err);
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "error from getItems", e });
//     });
// };

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(ERROR_CODES.Forbidden)
          .send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BadRequest)
          .send({ message: "Bad Request and/or invalid input" });
      } else {
        res
          .status(ERROR_CODES.DefaultError)
          .send({ message: "Something went wrong" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      handleFailError();
    })
    .then(() => res.status(200).send({ message: "Item has been liked" }))
    .catch((err) => {
      handleCatchError(err, res);
    });
};

function dislikeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      handleCatchError(req, res, err);
    });
}

const updateItem = (req, res) => {
  const { itemId } = req.param;
  const { imageUrl } = req.body;

  ClothingItem.findOneAndUpdate(itemId, { $set: { imageUrl } })
    .orFail(() => {
      handleFailError();
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      handleCatchError(err, res);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
  updateItem,
};
