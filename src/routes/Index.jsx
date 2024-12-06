import { Routes, Route } from "react-router-dom";
import VerifyEmail from "../pages/VerifyEmail";
import AuthForm from "../components/AuthForm";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} /> {/* Login/Sign Up */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<div>404 Not Found</div>} /> {/* Simple 404 */}
    </Routes>
  );
};

export default AppRoutes;
