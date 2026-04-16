import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import RoleSelect from "./Pages/RoleSelect/RoleSelect.jsx";
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import AdminApprovals from "./Pages/Admin/AdminApprovals.jsx";
import AdminUsers from "./Pages/Admin/AdminUsers.jsx";
import AdminOwners from "./Pages/Admin/AdminOwners.jsx";
import AdminHostels from "./Pages/Admin/AdminHostels.jsx";
import AdminReports from "./Pages/Admin/AdminReports.jsx";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard.jsx";
import UserDashboard from "./Pages/User/UserDashboard.jsx";
import HostelDetail from "./Pages/User/HostelDetail.jsx";
import PaymentPage from "./Pages/User/PaymentPage.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  const location = useLocation();

  // Hide Navbar/Footer on Auth screens or inside nested layouts like AdminLayout could handle it itself
  // For now keep hideLayout false for dashboard if we want navbar, BUT admin usually doesn't have the main navbar
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";
  const showCities = location.pathname.startsWith("/user");
  const isDashboard = location.pathname.startsWith("/user") || location.pathname.startsWith("/owner") || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar showCities={showCities} isDashboard={isDashboard} />}

      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Routes with Layout */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="owners" element={<AdminOwners />} />
          <Route path="hostels" element={<AdminHostels />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="/owner" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/hostel/:id" element={<ProtectedRoute allowedRoles={["user"]}><HostelDetail /></ProtectedRoute>} />
        <Route path="/user/payment/:id" element={<ProtectedRoute allowedRoles={["user"]}><PaymentPage /></ProtectedRoute>} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
