const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use((req, res, next) => {
  req.user = { _id: "64b5a05417f72089bdcab6c8" };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT);
