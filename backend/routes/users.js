const express = require("express");
const router = express.Router();

// Login page
router.get("/login", (req, res) => res.send("Login Page"));

// Register page
router.get("/register", (req, res) => res.send("Register Page"));

module.exports = router;
