import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Thought } from "./models/Thought.js"; // Adjust the import path as necessary

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/happy-thoughts-api";
mongoose.connect(mongoUrl);

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


// Endpoint to get API documentation
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});


// Endpoint to get all thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thoughts", details: error.message });
  }
});

// Endpoint to create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: "Message must be between 5 and 140 characters" });
  }

  try {
    console.log("Creating new thought:", message);
    const placeholderUserId = "testUserId"; // Hardcoded user ID for testing
    const newThought = await new Thought({ message, createdBy: placeholderUserId }).save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ error: "Failed to create thought", details: error.message });
  }
});

// Endpoint to like a thought
app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } }, // Increment the hearts count
      { new: true } // Return the updated document
    );

    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: "Failed to like the thought", details: error.message });
  }
});

// Endpoint to delete a thought
app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const placeholderUserId = "testUserId"; // Hardcoded user ID for testing
    const deletedThought = await Thought.findOneAndDelete({
      _id: id,
      createdBy: placeholderUserId,
    });

    if (!deletedThought) {
      return res.status(404).json({ error: "Thought not found or not authorized" });
    }

    res.status(200).json({ message: "Thought deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete thought", details: error.message });
  }
});

// Endpoint to get a single thought by ID
app.get("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the thought", details: error.message });
  }
});

// Endpoint to update a thought
app.put("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: "Message must be between 5 and 140 characters" });
  }

  try {
    const placeholderUserId = "testUserId"; // Hardcoded user ID for testing
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: id, createdBy: placeholderUserId },
      { message },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found or not authorized" });
    }

    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: "Failed to update thought", details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


