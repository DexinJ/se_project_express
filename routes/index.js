const router = require("express").Router();
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);
