import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints";
import fs from "fs"

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"))

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// API documentation using express-list-endpoints
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
})
// Get all thoughts
app.get("/thoughts", (req, res) => {
  res.json(data)
})

// Get a single thought by _id
app.get("/thoughts/:id", (req, res) => {
  const { id } = req.params
  const thought = data.find(t => t._id === id)
  if (thought) {
    res.json(thought)
  } else {
    res.status(404).json({ error: "Thought not found" })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
