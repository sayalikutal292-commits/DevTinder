const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 3,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["Male", "Female", "Other"].includes(val)) {
          throw new Error("Geneder data is not valide");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder292", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.isValidPassword = async function (userPassword) {
  const isPasswordValid = bcrypt.compare(userPassword, this.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
