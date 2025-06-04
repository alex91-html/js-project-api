import cors from "cors"
import express from "express"
// import dotenv from "dotenv"
import Data from "./data.json"

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080 // right now its the locahost port
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// END POINTS
// Start defining your routes here 
app.get("/", (req, res) => {
  res.send("Hello Technigo! hej hej hej!")
})

// Endpoint to get all data
app.get("/thoughts", (req, res) => {
  res.json(Data)
});


// endpoint to get one thought by id
app.get("/thoughts/:id", (req, res) => {
  console.log("Requested id:", req.params.id, "Type:", typeof req.params.id)
  console.log("All IDs in Data:", Data.map(t => t.id))
  const id = Number(req.params.id)
  const thought = Data.find(thought => thought.id === id)
  if (thought) {
    res.json(thought)
  } else {
    res.status(404).send({ error: "I'm sorry the thought was not found" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
