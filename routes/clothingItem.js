const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
  updateItem,
} = require("../controllers/clothingItem");

router.post("/", auth, createItem);

router.get("/", getItems);

router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth, dislikeItem);

router.put("/:itemId", auth, updateItem);

module.exports = router;
