const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

// get all feed except
// its own profile
// if connection request accepted, ignored should not be visible to each other

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideuserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideuserFromFeed.add(req.fromUserId.toString());
      hideuserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideuserFromFeed) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select("firstName lastName skills")
      .skip(skip)
      .limit(limit);
    res.json({
      users,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router;
