import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/thoughts"
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
  const endpoints = listEndpoints(app)
  res.json({
    message: "Welcome to the Happy Thoughts API!",
    endpoints: endpoints,
  })
})

//TODO: somthing is not working here, need to debug
//TODO: add query params to filter by quantity of hearts or date it has been created
// Endpoint to get all data, like all the thoughts

app.get("/thoughts", (req, res) => {

  const { time, hearts } = req.query;
  let filter = {};
  if (time) filter.createdAt = { $gte: new Date(time) };
  if (hearts) filter.hearts = { $gte: Number(hearts) };

  const thoughts = await Thought.find(filter).sort({ createdAt: -1 }).limit(20);
  res.json(thoughts);
});

// try {
//   let thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
//   console.log("Fetched thoughts:", thoughts); // Debug the query result
//   res.json(thoughts);
// } catch (error) {
//   console.error("Error fetching thoughts:", error); // Log the error details
//   res.status(500).json({ error: "Failed to fetch thoughts", details: error.message });
// }

//TODO: somthing is not working here, need to debug
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

//TODO: maybe i can delete this endpoint?
//endpoint to get thoughts by certain number of hearts or more
app.get("/thoughts/hearts/:minHearts", async (req, res) => {
  const minHearts = Number(req.params.minHearts)
  if (isNaN(minHearts)) {
    return res.status(400).send({ error: "Please provide a valid number of hearts" })
  }

  const filteredThoughts = await Thought.find({ hearts: { $gte: minHearts } })
  res.json(filteredThoughts)
})

//TODO: check if this endpoint works
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
  const { message, hearts } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { message, hearts },
      { new: true, runValidators: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
})

// Endpoint to delete a thought
app.delete("/thoughts/:id", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (deletedThought) {
      res.json({ message: "Thought deleted successfully" });
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Endpoint to like a thought
app.post("/thoughts/:id/like", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Endpoint to update a thought by ID with prompt
app.put("/thoughts/:id/prompt", async (req, res) => {
  const { id } = req.params;

  const newMessage = prompt("Enter the updated message:");
  if (!newMessage) return;

  try {
    const response = await fetch(`${API_URL}/thoughts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });

    if (response.ok) {
      const updatedThought = await response.json();
      setThoughts(thoughts.map((thought) =>
        thought._id === id ? updatedThought : thought
      ));
    } else {
      console.error("Failed to update thought:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error updating thought:", error);
  }
});

const deleteThought = async (id) => {
  try {
    const response = await fetch(`${API_URL}/thoughts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setThoughts(thoughts.filter((thought) => thought._id !== id));
    } else {
      console.error("Failed to delete thought:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error deleting thought:", error);
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


