const express = require("express");
const { auth } = require("./middleware/auth");
const app = express();
const connectDB = require("./Config/database.js");
const User = require("./models/user.js");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Raavi",
    lastName: "Kutal",
    emailId: "Ravvi",
  });

  try {
    await user.save();
    res.send("User added succesfully!!");
  } catch (err) {
    res.status(400).send("Error saving data" + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3001, () => {
      console.log("Server is successfully listen on port 3001");
    });
  })
  .catch((err) => {
    console.log("Database connection failed..");
  });
