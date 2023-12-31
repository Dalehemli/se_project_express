const jwt = require("jsonwebtoken");
const { handleCatchError, ERROR_CODES } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res
        .status(ERROR_CODES.Unauthorized)
        .send({ message: "Authorization required" });
      return;
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res
        .status(ERROR_CODES.Unauthorized)
        .send({ message: "Authorization required" });
      return;
    }
    req.user = payload;
    next();
  } catch (err) {
    handleCatchError(err, res);
  }
};
