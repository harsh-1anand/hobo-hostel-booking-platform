import { useEffect, useState } from "react";
import { FiUsers, FiHome, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import { getAdminStats } from "../../Services/api";
import { toast } from "react-hot-toast";
import "./Admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHostels: 0,
    totalBookings: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load live stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page-content">
      <h1>Admin Control Center</h1>

      {/* Platform Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{loading ? "-" : stats.totalUsers}</p>
          </div>
          <FiUsers className="stat-icon" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Hostels</h3>
            <p>{loading ? "-" : stats.totalHostels}</p>
          </div>
          <FiHome className="stat-icon" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <p>{loading ? "-" : stats.totalBookings}</p>
          </div>
          <FiTrendingUp className="stat-icon" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Approvals</h3>
            <p>{loading ? "-" : stats.pendingApprovals}</p>
          </div>
          <FiAlertCircle className="stat-icon" />
        </div>
      </div>

      {/* Activity Section */}
      <div className="admin-activity recent-section">
        <h2>Recent Platform Activity</h2>

        <div className="activity-item">
          <div className="activity-text">
            <p>New owner registered in <strong>Noida</strong></p>
            <span>10 mins ago</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-text">
            <p>Hostel approval requested</p>
            <span>25 mins ago</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-text">
            <p>Booking flagged for review</p>
            <span>1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;