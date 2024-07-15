const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Log user action
    console.log(
      `User: ${decoded.username}, Action: ${req.method} ${
        req.originalUrl
      }, Time: ${new Date()}`
    );

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
