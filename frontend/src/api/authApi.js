import axiosInstance from "./axiosInstance";

const handleRequest = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error.response?.data || error.message);
    throw error;
  }
};
// Login User
export const loginUser = (credentials) => handleRequest("post", "/users/login", credentials);

// Register User
export const registerUser = (userData) => handleRequest("post", "/users/register", userData);

// Get Logged-in User Info
export const getMe = () => handleRequest("get", "/users/me");

// Change Password
export const changePassword = (passwordData) => handleRequest("put", "/users/change-password", passwordData);

// Reset Password
export const resetPassword = (id, newPassword) => handleRequest("put", `/users/${id}/reset-password`, { newPassword });