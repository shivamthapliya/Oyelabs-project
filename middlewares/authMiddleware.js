const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  // 🔹 Try getting token from Authorization header/cookies
  const token=req.cookies?.token||req?.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Authentication failed: No token provided" });
  }

  if (!token) {
    return res.status(403).json({ error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
