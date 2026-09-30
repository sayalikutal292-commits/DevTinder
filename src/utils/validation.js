const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Filed are mandatory");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateEditData = (req) => {
  const allowedField = ["firstName", "lastName", "age", "gender", "skills"];
  const isFieldAllowed = Object.keys(req.body).every((key) =>
    allowedField.includes(key),
  );
  return isFieldAllowed;
};

module.exports = {
  validateSignup,
  validateEditData,
};
