import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose, { mongo } from "mongoose"
// import dotenv from "dotenv"
import Data from "./data.json"



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
  hearts: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model("Thought", thoughtSchema)

// END POINTS
// Start defining your routes here 
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Thoughts API!",
    endpoints: listEndpoints(app)
  })
})
// Endpoint to get all data
app.get("/thoughts", (req, res) => {
  res.json(Data)
});


// endpoint to get one thought by id
app.get("/thoughts/:id", (req, res) => {
  const thought = Data.find(thought => thought._id === req.params.id)
  if (thought) {
    res.json(thought)
  } else {
    res.status(404).send({ error: "I'm sorry the thought was not found" })
  }
})

//endpoint to get thoughts by certain number of hearts or more
app.get("/thoughts/hearts/:minHearts", (req, res) => {
  const minHearts = Number(req.params.minHearts)
  if (isNaN(minHearts)) {
    return res.status(400).send({ error: "Please provide a valid number of hearts" })
  }

  const filteredThoughts = Data.filter(thought => thought.hearts >= minHearts)
  res.json(filteredThoughts)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


