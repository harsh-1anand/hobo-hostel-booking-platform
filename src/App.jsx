import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import RoleSelect from "./Pages/RoleSelect/RoleSelect.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard.jsx";
import UserDashboard from "./Pages/User/UserDashboard.jsx";

function App() {
  const location = useLocation();

  // Show cities only on user dashboard
  const showCities = location.pathname.startsWith("/user");

  return (
    <>
      <Navbar showCities={showCities} />

      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;