const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { connectMongo } = require("./db");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.json());



const port = 5000;
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

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}`
  );
}); 
