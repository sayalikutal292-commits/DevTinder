const auth = (req, res, next) => {
  console.log("Authorization checked!!!");
  const authToken = "xyzqwee";
  const isAuthorized = authToken === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthriozed token!!");
  }
};

module.exports = { auth };
