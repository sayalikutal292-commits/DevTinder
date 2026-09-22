const mongoos = require("mongoose");

const connectDB = async () => {
  await mongoos.connect(
    "mongodb+srv://sayalikutal292_db_user:hCRs5Acmq6qVhoyo@cluster1.xyeiqdd.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
