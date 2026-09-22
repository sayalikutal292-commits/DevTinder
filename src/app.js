const express = require("express");
const { auth } = require("./middleware/auth");
const app = express();

app.use("/admin", auth);
app.get("/admin/getAllData", (req, res) => {
  res.send("Get all data for Admin");
});

app.get("/admin/delete", (req, res) => {
  res.send("Delet data for Admin");
});

app.listen(3001, () => {
  console.log("Server is successfully listen on port 3001");
});
