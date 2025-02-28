import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";
import { DESIGNATIONS } from '../../constants/designations.js';
import { ROLES } from '../../constants/roles.js';

// Register User
export const registerUser = async (req, res) => {

  try {
    console.log("Incoming request body:", req.body); // 🟢 Log request body before validation

    const user = new User(req.body);
    console.log("User instance before saving:", user); // 🟢 Check what is stored before saving

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", email); // Log email being used

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid credentials" }); 
    }

    console.log("Login successful for user:", user.email);
    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
// Get All Users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, designation, search } = req.query;

    let filter = {};

    if (role) filter.role = role;
    if (designation) filter.designation = designation;

    // Search by first name or last name
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.json({
        data: users,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        },
    });
} catch (error) {
    res.status(500).json({ message: "Server error" });
}
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, contactNumber, userType, designation, role, status, location } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (userType) {
      if (!["internal", "vendor"].includes(userType.toLowerCase())) {
        return res.status(400).json({ message: "Invalid userType" });
      }
      updateData.userType = userType;
    }
    if (designation) {
      const allDesignations = [...DESIGNATIONS.Internal, ...DESIGNATIONS.Vendor];
      if (!allDesignations.includes(designation)) {
        return res.status(400).json({ message: "Invalid designation" });
      }
      updateData.designation = designation;
    }
    if (role) {
      if (!Object.values(ROLES).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      updateData.role = role;
    }
    if (status) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      updateData.status = status;
    }
    if (location) {
      if (typeof location !== "object") {
        return res.status(400).json({ message: "Invalid location format" });
      }
      console.log(location)
      updateData.location = {};
      if (location.city) updateData.location.city = location.city;
      if (location.state) updateData.location.state = location.state;
      if (location.country) updateData.location.country = location.country;
    }

    updateData.lastUpdatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // Log actual error in console
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    // Find user and ensure password is accessible
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    // Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      });
    }

    // Set new password (will be hashed by `pre("save")`)
    user.password = newPassword;
    user.lastUpdatedBy = userId; // Track who updated the password

    await user.save(); // `pre("save")` will hash password & update `lastUpdatedAt`

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const resetUserPassword = async (req, res) => {
  try {
    const adminId = req.user.id; // Admin ID from token
    const { id } = req.params; // Target User ID
    const { newPassword } = req.body;
    // Ensure admin is authorized
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can reset passwords." });
    }

    // Find the target user
    const user = await User.findById(id).select("+password"); // Ensure password is accessible
    if (!user) return res.status(404).json({ message: "User not found" });

    // // Validate password strength
    // if (!validatePassword(newPassword)) {
    //   return res.status(400).json({
    //     message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    //   });
    // }

    // Hash new password
    user.password = newPassword;
    user.lastUpdatedBy = adminId; // Track who updated it
    await user.save();

    res.status(200).json({ message: "User password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const adminId = req.user.id; // Admin ID from token
    const { id } = req.params; // Target User ID

    // Ensure admin is authorized
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can delete users." });
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};