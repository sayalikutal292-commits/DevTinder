const express = require("express");
const { auth } = require("./middleware/auth");
const app = express();
const connectDB = require("./Config/database.js");
const User = require("./models/user.js");

app.use(express.json());

// get all user data
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error while reding data" + err.message);
  }
});

// get one user

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    console.log(user);
    if (user === null) {
      res.send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User(req.body);
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
