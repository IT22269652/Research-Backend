const jwt = require("jsonwebtoken");

// Must match the secret in your controller
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

module.exports = function (req, res, next) {
  // 1. Get token from header
  const token = req.header("Authorization");

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  // 3. Verify token
  try {
    // Remove "Bearer " if sent in that format
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, JWT_SECRET);

    req.user = decoded; // Add user payload to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
