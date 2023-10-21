const router = require("express").Router();

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// CRUD

// Create
router.post("/", auth, createItem);

// Read
router.get("/", getItem);

// Update
router.put("/:itemId/likes", auth, likeItem);
// Delete
router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
