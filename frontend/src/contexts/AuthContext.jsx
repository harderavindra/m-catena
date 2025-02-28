import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const login = async (email, password, setErrorMessage) => {
    try {
      console.log("Attempting login with:", email, password);
  
      const response = await axiosInstance.post("/users/login", { email, password });
      console.log("Login response received:", response);
  
      if (!response.data || !response.data.token) {
        console.error("Invalid response from server:", response.data);
        throw new Error("Invalid response from server");
      }
  
      const { token, user } = response.data;
      console.log("Storing user data:", user);
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
  
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
  
      let errorMessage = "An unexpected error occurred.";
  
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        errorMessage = error.response.data?.message || "Invalid credentials.";
      } else if (error.request) {
        console.error("No response from server.");
        errorMessage = "No response from server. Please check your connection.";
      } else {
        console.error("Request error:", error.message);
        errorMessage = error.message;
      }
  
      setErrorMessage(errorMessage); // ✅ Set error message in state for UI display
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Prevent page rendering before authentication is checked
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
