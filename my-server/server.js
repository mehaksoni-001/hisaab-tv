const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/data", (req, res) => {
  const { username } = req.body;
  console.log("Received username:", username);
  res.json({ message: "Data received", user: username });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
