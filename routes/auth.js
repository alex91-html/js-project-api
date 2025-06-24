import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.js";

const router = express.Router();

// Helper to generate a random access token
const generateAccessToken = () => crypto.randomBytes(32).toString("hex");

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = generateAccessToken();
    const user = new User({ username, email, password: hashedPassword, accessToken });
    await user.save();
    res.status(201).json({ message: "User registered successfully.", accessToken, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user.", details: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
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