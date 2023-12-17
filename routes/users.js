const router = require("express").Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");

// CRUD

// Create

// Read
router.get("/me", getCurrentUser);

// Edit
router.patch("/me", validateUpdateProfile, updateProfile);

// Delete

module.exports = router;
