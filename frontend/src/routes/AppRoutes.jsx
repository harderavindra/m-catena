import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Authentication & Pages
import Login from "../pages/auth/Login";
import Profile from "../pages/users/Profile";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/users/Home";
import MainLayout from "../components/layout/MainLayout";
import UsersPage from "../pages/users/UsersPage";
import UserDetail from "../pages/users/UserDetail";
import AddUser from "../pages/users/AddUser";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Routes with Layout */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/adduser" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
