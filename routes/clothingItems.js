const router = require("express").Router();

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

// CRUD

// Create
router.post("/", validateCardBody, auth, createItem);

// Read
router.get("/", getItem);

// Update
router.put("/:itemId/likes", validateId, auth, likeItem);
// Delete
router.delete("/:itemId", validateId, auth, deleteItem);
router.delete("/:itemId/likes", validateId, auth, unlikeItem);

module.exports = router;
