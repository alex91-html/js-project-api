import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

// Define the Thought schema
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", thoughtSchema);

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
    const newThought = await new Thought({ message }).save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ error: "Failed to create thought", details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


