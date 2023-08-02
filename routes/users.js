const router = require("express").Router();

const { getUser, getUsers, createUser } = require("../controllers/users");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;

// const router = require("express").Router();
// const auth = require("../middlewares/auth");

// const { getCurrentUser, updateUser } = require("../controllers/users");

// // router.post("/", createUser);
// // router.get("/", getUsers);
// router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateUser);

// module.exports = router;
