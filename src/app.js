const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling the rout user");
    next();
    //res.send("Get User List");
  },
  (req, res) => {
    console.log("Handling route user2");
    res.send("User List2");
  },
);

app.listen(3001, () => {
  console.log("Server is successfully listen on port 3001");
});
