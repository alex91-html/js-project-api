import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.js";

const router = express.Router();

// Helper to generate a random access token
const generateAccessToken = () => crypto.randomBytes(32).toString("hex");

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = generateAccessToken();
    const user = new User({ username, password: hashedPassword, accessToken });
    await user.save();
    res.status(201).json({ message: "User registered successfully.", accessToken, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user.", details: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    // Generate a new accessToken on login
    user.accessToken = generateAccessToken();
    await user.save();
    res.status(200).json({ accessToken: user.accessToken, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in.", details: error.message });
  }
});

export default router; 