import { useState } from "react";
import "./Admin.css";

function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-page">

      {/* Sidebar Button */}
      <div
        className="admin-menu-btn"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰

        {menuOpen && (
          <div className="admin-menu-dropdown">
            <p>Dashboard</p>
            <p>Manage Users</p>
            <p>Manage Hostels</p>
            <p>Approvals</p>
            <p>Reports</p>
            <p>Logout</p>
          </div>
        )}
      </div>

      {/* Main Section */}
      <div className="admin-main">

        <h1>Admin Control Center</h1>

        {/* Platform Stats */}
        <div className="admin-stats">
          <div className="ui-card ui-card-success">
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>

          <div className="ui-card ui-card-success">
            <h3>Total Hostels</h3>
            <p>320</p>
          </div>

          <div className="ui-card ui-card-success">
            <h3>Total Bookings</h3>
            <p>4,890</p>
          </div>

          <div className="ui-card ui-card-success">
            <h3>Pending Approvals</h3>
            <p>18</p>
          </div>
        </div>

        {/* Activity Section */}
        <div className="admin-activity">
          <h2>Recent Platform Activity</h2>

          <div className="activity-item">
            <p>New owner registered in Noida</p>
            <span>10 mins ago</span>
          </div>

          <div className="activity-item">
            <p>Hostel approval requested</p>
            <span>25 mins ago</span>
          </div>

          <div className="activity-item">
            <p>Booking flagged for review</p>
            <span>1 hour ago</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;