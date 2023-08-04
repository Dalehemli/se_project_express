// const router = require("express").Router();
// const clothingItem = require("./clothingItem");
// const User = require("./users");
// const { ERROR_404 } = require("../utils/errors");

// router.use("/items", clothingItem);
// router.use("/users", User);

// router.use((req, res) => {
//   res.status(ERROR_404).send({ message: "Request resource was not found" });
// });

// module.exports = router;

const router = require("express").Router();
const clothingItem = require("./clothingItem");
const User = require("./users");
const { createUser, login } = require("../controllers/users");
const { ERROR_CODES } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res.status(ERROR_CODES.NotFound).send({
    message: "Request resource was not found",
  });
});

module.exports = router;
