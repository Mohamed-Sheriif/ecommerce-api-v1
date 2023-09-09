const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign(
    {
      userId: payload._id,
      username: payload.name,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

module.exports = createToken;
