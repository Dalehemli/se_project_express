const User = require("../models/users");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const {
  handleCatchError,
  handleFailError,
  ERROR_CODES,
} = require("../utils/errors");
// const { JWT_SECRET } = require("../utils/config");

// function handleCatchError(res, err) {
//   if (err.name === "ValidationError") {
//     return res.status(ERROR_400).send({
//       message:
//         "Invalid data passed to the methods for creating a user, or invalid ID passed to the params",
//     });
//   }
//   if (err.name === "CastError") {
//     return res.status(ERROR_400).send({
//       message:
//         "There is no user with the requested ID, or the request was sent to a non-existent address.",
//     });
//   }
//   return res.status(ERROR_500).send({
//     message: "An error has occurred on the server",
//   });
// }

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      handleCatchError(res, err);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({
          message:
            "There is no user with the requested ID, or the request was sent to a non-existent address.",
        });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(ERROR_400).send({
          message:
            "Invalid data passed to the methods for creating a user, or invalid ID passed to the params",
        });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleCatchError(res, err);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  // updateUser,
};

// const getCurrentUser = (req, res) => {
//   const { _id } = req.user; // Retrieve user ID from req.user object

//   User.findById(_id)
//     .orFail(() => {
//       handleFailError();
//     })
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => {
//       handleCatchError(err, res);
//     });
// };

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   if (!password) {
//     return res.status(400).send({ error: "Password is required" });
//   }

//   bcrypt.hash(password, 10).then((hash) => {
//     User.create({ name, avatar, email, password: hash })
//       .then((user) => {
//         const userData = user.toObject();
//         delete userData.password;
//         return res.status(201).send({ data: userData });
//       })
//       .catch((err) => handleCatchError(err, res));
//   });
//   return undefined;
// };

// const updateUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, avatar },
//     { new: true, runValidators: true },
//   )
//     .orFail(() => {
//       handleFailError();
//     })
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     .catch((err) => {
//       handleCatchError(err, res);
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(ERROR_CODES.Unauthorized)
//       .send({ message: "You are not authorized to do this" });
//   }
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       res.send({
//         token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       console.log(err.name);
//       handleCatchError(err, res);
//     });
// };

// module.exports = {
//   getCurrentUser,
//   // getUsers,
//   createUser,
//   login,
//   updateUser,
// };
