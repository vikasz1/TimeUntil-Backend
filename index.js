const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { connectMongo } = require("./db");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.json());

const port = 5000 || process.env.PORT;
connectMongo();

//Schema
const timerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  timers: [timerSchema],
  // Other user properties can be added here as needed
});

//Model
const MyUsers = mongoose.model("timeUntil", userSchema);

//Routes
app.get("/", async (req, res) => {
  res.send("<h2>/data => all data <br> /data/:user => user wise data</h2>");
});
app.get("/data", async (req, res) => {
  res.send(await MyUsers.find());
});
app.get("/data/:username", async (req, res) => {
  const username = req.params.username;
  const data = await MyUsers.find({ username: username });
  res.send(data);
});

app.post("/data", async (req, res) => {
  const data = new MyUsers({
    username: req.body.username,
    email: req.body.email,
    // plan to add default timer as date of birth
  });
  const userExist = await MyUsers.findOne({ username: data.username });
  if (userExist !== null) res.send("User already exist");
  else {
    await data.save();
    console.log("Data Added successfully");
    res.send(data);
  }
});
app.put("/data/:username/timers", async (req, res) => {
  const { username } = req.params;
  const newTimer = req.body;

  try {
    const user = await MyUsers.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.timers.push(newTimer);
    // MyUsers.updateOne(
    //   {username:username},
    //   {$push: {timers:timer}},

    // )
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/data", async (req, res) => {
  try {
    const eventId = req.body.eventId;
    console.log("Finding: " + eventId);
    const existingEvent = await MyUsers.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    await existingEvent.deleteOne();
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(
    `Timer Backend listening on port ${port}. \n Access http://localhost:${port}/data`
  );
});
