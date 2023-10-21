const router = require("express").Router();
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", auth, itemRouter);
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
