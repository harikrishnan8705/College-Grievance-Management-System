const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authController");

// Routes

router.post("/login", loginUser);

module.exports = router;
