const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { createUser, login } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.disable("x-powered-by");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(routes);

app.listen(PORT, () => {});
console.log("App listening at PORT 3001")