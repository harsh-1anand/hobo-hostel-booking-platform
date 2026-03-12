import { useState } from "react";
import "./Owner.css";

function OwnerDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="owner-page">

      {/* Sidebar Button */}
      <div
        className="owner-menu-btn"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰

        {menuOpen && (
          <div className="owner-menu-dropdown">
            <p>Dashboard</p>
            <p>Manage Hostels</p>
            <p>Bookings</p>
            <p>Earnings</p>
            <p>Add Hostel</p>
            <p>Logout</p>
          </div>
        )}
      </div>

      {/* Main Section */}
      <div className="owner-main">

        <h1>Owner Dashboard</h1>

        {/* Stats Section */}
        <div className="owner-stats">
          <div className="ui-card ui-card-success">
            <h3>Total Hostels</h3>
            <p>4</p>
          </div>

          <div className="ui-card ui-card-success">
            <h3>Active Bookings</h3>
            <p>12</p>
          </div>

          <div className="ui-card ui-card-success">
            <h3>Monthly Revenue</h3>
            <p>₹48,000</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button>Add New Hostel</button>
          <button>View All Bookings</button>
        </div>

        {/* Recent Activity */}
        <div className="recent-section">
          <h2>Recent Bookings</h2>

          <div className="booking-card">
            <p><strong>Rahul</strong> booked Sunrise PG</p>
            <span className="status confirmed">Confirmed</span>
          </div>

          <div className="booking-card">
            <p><strong>Ananya</strong> booked City Stay</p>
            <span className="status pending">Pending</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default OwnerDashboard;