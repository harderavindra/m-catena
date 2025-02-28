import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user || !user._id) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
