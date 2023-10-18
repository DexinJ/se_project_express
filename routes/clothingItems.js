const router = require("express").Router();

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

//CRUD

//Create
router.post("/", createItem);

//Read
router.get("/", getItem);

//Update
router.put("/:itemId/likes", likeItem);
//Delete
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
