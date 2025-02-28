import express from "express";
import { registerUser, loginUser, getUsers, getMe, getUserById,updateUser, changePassword, resetUserPassword, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getUsers);

// Place `/me` BEFORE any `/:id` routes
router.get("/me", authMiddleware, getMe);
router.put("/change-password", authMiddleware, changePassword);

router.get("/:id", authMiddleware, getUserById);
router.put("/:id/reset-password", authMiddleware, resetUserPassword);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
export default router;