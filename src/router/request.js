const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// sending connection request
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //checked allowed status : ignored, interested
    // If there is existing connection request
    // if A->B connection exist B->A is not valid
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalide Status " + status);
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnection) {
      throw new Error("Connection already exixts");
    }

    // If to user is not exixt
    const istoUser = await User.findById(toUserId);
    if (!istoUser) {
      throw new Error("User not exist");
    }

    // check if fromUserId is equal to toUserID

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      message: "Connection request " + status + " successfully!!",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// reviewing connection request
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // validation on status
      // is user logged in or not? toUserId === loggedInUser
      // user should be valid user / connection request present in DB or not?

      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Connection not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request" + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  },
);

module.exports = router;
