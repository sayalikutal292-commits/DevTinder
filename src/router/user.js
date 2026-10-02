const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

// get all the pending connection request for loggedin user
router.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    if (!connectionRequest) {
      throw new Error("Connection not found");
    }
    res.json({
      message: "Connection found",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//  user3 -> user1 -> accepted
//  user1 -> user2  -> accepted

// get all the connections of logged in user
// if loggedin as user1 he can able to see user2, user3 in connection

//223.236.99.107/32

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = router;
