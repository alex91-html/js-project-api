import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose, { mongo } from "mongoose"
// import dotenv from "dotenv"
// import Data from "./data.json"





// the mongo URL to connect to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts"
mongoose.connect(mongoUrl)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080 // right now its the locahost port
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const thoughtSchema = new mongoose.Schema({
  _id: String,
  message: String,
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model("Thought", thoughtSchema)


if (process.env.RESET_DB) {
  const seedData = async () => {
    await Thought.deleteMany({}) // Clear the collection before seeding
    thoughtData.forEach(thought => {
      new Thought(thought).save()
    })
  }
  seedData()
}



// END POINTS
// Start defining your routes here 
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Thoughts API!",
    endpoints: listEndpoints(app)
  })
})

// Endpoint to get all data
app.get("/thoughts", async (req, res) => {
  try {
    let thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch thoughts" });
  }
});

// endpoint to get one thought by id
app.get("/thoughts/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (thought) {
      res.json(thought)
    } else {
      res.status(404).json({ error: "Thought not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" })
  }
});

//endpoint to get thoughts by certain number of hearts or more
app.get("/thoughts/hearts/:minHearts", async (req, res) => {
  const minHearts = Number(req.params.minHearts)
  if (isNaN(minHearts)) {
    return res.status(400).send({ error: "Please provide a valid number of hearts" })
  }

  const filteredThoughts = await Thought.find({ hearts: { $gte: minHearts } })
  res.json(filteredThoughts)
})

// Endpoint to create a new thought
app.post("/thoughts", async (req, res) => {
  const { message, hearts } = req.body

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required and must be a string" })
  }

  if (hearts !== undefined && typeof hearts !== "number") {
    return res.status(400).json({ error: "Hearts must be a number" })
  }

  try {
    const newThought = await new Thought({ message, hearts }).save()
    res.status(201).json(newThought)
  } catch (error) {
    res.status(500).json({ error: "Failed to create thought" })
  }
})

// Endpoint to update a thought
app.put("/thoughts/:id", async (req, res) => {
  const { message, hearts } = req.body

  if (message && typeof message !== "string") {
    return res.status(400).json({ error: "Message must be a string" })
  }

  if (hearts !== undefined && typeof hearts !== "number") {
    return res.status(400).json({ error: "Hearts must be a number" })
  }

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { message, hearts },
      { new: true, runValidators: true }
    )
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ error: "Thought not found" })
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" })
  }
})

// Endpoint to delete a thought
app.delete("/thoughts/:id", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id)
    if (deletedThought) {
      res.json({ message: "Thought deleted successfully" })
    } else {
      res.status(404).json({ error: "Thought not found" })
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


