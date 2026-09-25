const express = require("express");
const { userAuth } = require("./middleware/auth");
const app = express();
const connectDB = require("./Config/database.js");
const User = require("./models/user.js");
const { validateSignup } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

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
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (isPasswordValid) {
      // create jwt
      const token = await user.getJWT();
      if (!token) {
        throw new Error("Invalid token");
      }
      // set token into cookie and send response back to user
      res.cookie("token", token);
      res.send("login Successfully");
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// sending connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " Connetion request send");
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
