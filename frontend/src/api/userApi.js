import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const fetchUsers = async (page = 1, limit = 10, role = "", designation = "", search = "") => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    params: { page, limit, role, designation, search }, // Removed `userType`
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
export const updateUserById = async (id, updatedFields) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, updatedFields, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  return response.data;
};

export const registerUser = async (dataFields) => {
  const response = await axios.post(`${API_URL}/register`, dataFields, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const resetPassword = async (userId, newPassword) => {
  return await axios.put(`${API_URL}/${userId}/reset-password`,   { newPassword }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};