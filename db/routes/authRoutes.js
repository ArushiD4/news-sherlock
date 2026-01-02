const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("✅ User registered:", newUser.email);
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    // Send a 500 error so the frontend knows something went wrong on the server
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign Token
    // Make sure process.env.JWT_SECRET is defined in your .env file!
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret", // Fallback if env is missing
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(" Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;