const router = require("express").Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

// CRUD

// Create

// Read
router.get("/me", getCurrentUser);

// Edit
router.patch("/me", updateProfile);

// Delete

module.exports = router;
