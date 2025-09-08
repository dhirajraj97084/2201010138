import "dotenv/config";
import jwt from "jsonwebtoken";

const fetUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ message: "Invalid auth token" });
  }
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetUser;