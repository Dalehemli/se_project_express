const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserInfo } = require("../middlewares/validation");
const { validateName } = require("../middlewares/validation");
const { validateAvatar } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch(
  "/me",
  auth,
  validateUserInfo,
  validateName,
  validateAvatar,
  updateUser,
);

module.exports = router;
