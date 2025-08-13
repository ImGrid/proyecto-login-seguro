const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth");
const { createAccountLimiter, loginLimiter } = require("../middleware/rateLimiting");
const { register, login, getProfile } = require("../controllers/authController");

// Rutas de autenticación
router.post("/register", createAccountLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
