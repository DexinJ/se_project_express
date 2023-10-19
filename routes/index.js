const router = require("express").Router();
const { BAD_REQUEST } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(BAD_REQUEST).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
