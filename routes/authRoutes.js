const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// --- PUBLIC ROUTES ---
router.post("/signup", authController.signup);
router.post("/login", authController.login); // <--- THIS WAS LIKELY MISSING

// --- PROTECTED ROUTES (Require Token) ---
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
