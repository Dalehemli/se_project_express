const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use(cors());

app.listen(PORT);
