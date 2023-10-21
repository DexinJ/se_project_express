const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");
const { createUser, login } = require("./controllers/users");

app.use(cors());
app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(routes);

app.listen(PORT, () => {});
