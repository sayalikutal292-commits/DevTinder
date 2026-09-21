const express = require("express");

const app = express();

app.use("/dashboard", (req, res) => {
  res.send("Welcome to Dashboard");
});
app.use("/signin", (req, res) => {
  res.send(" Sign In");
});

app.listen(3000, () => {
  console.log("Server is successfully listen on port 3000");
});
