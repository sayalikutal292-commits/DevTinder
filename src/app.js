const express = require("express");
const { auth } = require("./middleware/auth");
const app = express();
const connectDB = require("./Config/database.js");
const User = require("./models/user.js");
const { validateSignup } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
app.use(express.json());

// creating a user
app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  // validate data
  // encypt the password
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validateSignup(req);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    });
    await user.save();
    res.send("User added succesfully!!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("login Successfully");
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

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
    const user = await User.findOne({ _id: req.body.emailId });
    if (user === null) {
      res.send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

// Delete one user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const isDeleted = await User.findByIdAndDelete(userId);
    if (isDeleted === null) {
      res.send("User not found");
    } else {
      res.send("User deleted successfully!!");
    }
  } catch (err) {
    res.send("Something went wrong!!!");
  }
});

// update user

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const ALLOWED_UPDATE = ["skills, gender"];
  const isUpdateAllowed = Object.keys(data).every((k) => {
    ALLOWED_UPDATE.includes(k);
  });
  try {
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("Upadetd successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
    console.log("Something went wrong!!!" + err.message);
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
