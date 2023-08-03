const router = require("express").Router();
// const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,

  deleteItem,
  likeItem,
  dislikeItem,
  updateItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", getItems);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.put("/:itemId", updateItem);

module.exports = router;
