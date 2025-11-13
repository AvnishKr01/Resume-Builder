  const jwt = require("jsonwebtoken");

  const authMiddleware = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      // console.log(authHeader);
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1]; // get token part after "Bearer"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // req.userId = { _id: decoded.id }; // store decoded info

      req.user = { id: decoded.userId };
      next();

    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Invalid token", error: error.message });
    }
  };

  module.exports = authMiddleware;
