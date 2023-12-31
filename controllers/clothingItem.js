const ClothingItem = require("../models/clothingItem");
const {
  ERROR_CODES,
  handleFailError,
  handleCatchError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleCatchError(err, res);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      handleCatchError(err, res);
    });
};

// const deleteItem = (req, res) => {
//   ClothingItem.findById(req.params.itemId)
//     .then((item) => {
//       if (!item) {
//         handleFailError("Item ID not found", 404);
//       }
//       if (String(item.owner) !== req.user._id) {
//         return res
//           .status(ERROR_CODES.Forbidden)
//           .send({ message: "You are not authorized to delete this item" });
//       }
//       return item.deleteOne().then(() => {
//         res.send({ message: "Item deleted" });
//       });
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
//       } else if (err.name === "CastError") {
//         res
//           .status(ERROR_CODES.BadRequest)
//           .send({ message: "Bad Request and/or invalid input" });
//       } else {
//         res
//           .status(ERROR_CODES.DefaultError)
//           .send({ message: "Something went wrong" });
//       }
//     });
// };

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        handleFailError("Item ID not found", ERROR_CODES.NotFound);
      }
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
      handleCatchError(err, res);
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
    .then((item) => {
      if (!item) {
        handleFailError("Item ID not found", ERROR_CODES.NotFound);
      }
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      handleCatchError(err, res);
    });
}

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
