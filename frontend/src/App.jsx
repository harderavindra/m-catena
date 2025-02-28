import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/auth/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/users/Profile';
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/users/Home";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
  );
}

export default App;
