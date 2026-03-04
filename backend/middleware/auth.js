const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "opd_secret_key_2026_demo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "opd_secret_key_2026_demo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Check if role contains "admin" to handle different admin roles like "admin" or "hospital_admin"
    if (!decoded.role || !decoded.role.toLowerCase().includes("admin")) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.userId = decoded.id;
    next();
  });
};

exports.verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "opd_secret_key_2026_demo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (decoded.role !== "hospital_admin" && decoded.role !== "super_admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.adminId = decoded.id;
    next();
  });
};
