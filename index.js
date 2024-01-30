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
//Model
const MyDates = mongoose.model("timeUntil", { title: String, date: Date });

app.get("/data", async (req, res) => {
  const data = await MyDates.find();
  res.send(data);
});

app.post("/data", async (req, res) => {
  const data = new MyDates({ 
    title: req.body.title,
    date: req.body.date,
  });

  await data.save();
  console.log("Date Added successfully");
  res.send(data);
});

app.delete("/data", async (req, res) => {
  try { 
    const eventId = req.body.eventId;
    console.log("Finding: " + eventId);
    const existingEvent = await MyDates.findById(eventId);
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
  console.log(`Example app listening on port ${port}`);
});
