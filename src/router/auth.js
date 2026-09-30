const express = require("express");
const router = express.Router();
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const { userAuth } = require("../middleware/auth");

// creating a user
router.post("/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

// update password
router.patch("/updatePassword", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.updatedPassword;
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter strong password");
    }
    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);
    const loggedinUser = req.user;
    loggedinUser.password = encryptedNewPassword;
    await loggedinUser.save();
    res.send("Password updated Successfully!!!");
  } catch (err) {
    res.send("Error: " + err);
  }
});

// To do
// Forgot password

// logout user
router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfully!!!");
});

module.exports = router;
