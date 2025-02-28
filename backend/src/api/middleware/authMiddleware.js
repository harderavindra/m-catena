import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized, no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Only store the ID

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

export const resetUserPassword = async (req, res) => {
  try {
    const adminId = req.user.id; // Get admin user ID from token
    const { id } = req.params; // Get user ID from request params
    const { newPassword } = req.body;

    // Ensure admin is authorized
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "User password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
