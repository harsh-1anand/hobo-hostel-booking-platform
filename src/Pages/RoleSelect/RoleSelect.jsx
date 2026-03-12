import { useNavigate } from "react-router-dom";
import "./RoleSelect.css";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="roleselect-hero">

      <div className="hero-content">

        <h1 className="hero-title">Find Your Perfect Stay with HOBO</h1>

        <p className="hero-subtitle">
          A modern platform for students and travelers to discover
          comfortable hostels across cities.
        </p>

        <h2 className="role-heading">Choose Your Experience</h2>

        <div className="role-card-container">

          <div className="role-card" onClick={() => navigate("/user")}>
            <div className="role-icon">👤</div>
            <h3>User</h3>
            <p>Search and book hostels easily</p>
          </div>

          <div className="role-card" onClick={() => navigate("/owner")}>
            <div className="role-icon">🏢</div>
            <h3>Owner</h3>
            <p>Manage hostels and bookings</p>
          </div>

          <div className="role-card" onClick={() => navigate("/admin")}>
            <div className="role-icon">⚙️</div>
            <h3>Admin</h3>
            <p>Control and monitor platform activity</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RoleSelect;