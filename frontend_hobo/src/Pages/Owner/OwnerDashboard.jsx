import { useState, useEffect } from "react";
import { addHostel, getOwnerStats } from "../../Services/api";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { FiHome, FiTrendingUp, FiUsers, FiPlusSquare, FiBriefcase, FiTag, FiMapPin, FiDollarSign, FiInfo, FiImage, FiAlignLeft, FiCheckCircle, FiUpload } from "react-icons/fi";
import "./Owner.css";

function OwnerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="owner-page">
      {/* Decorative Title Area */}
      <div className="owner-top-banner">
        <h1 className="owner-title">Owner <span>Portal</span></h1>
        <p>Manage your luxury properties efficiently.</p>
      </div>

      {/* Main Content Area */}
      <div className="owner-main-content">
        {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === "addHostel" && <AddHostelTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "manage" && <ManageHostelsTab />}
      </div>
    </div>
  );
}

function OverviewTab({ setActiveTab }) {
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, hostelCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getOwnerStats();
        setStats({
          totalRevenue: res.data.totalEarnings || 0,
          totalBookings: res.data.totalBookings || 0,
          hostelCount: res.data.hostelCount || 0
        });
      } catch (err) {
        toast.error("Failed to load owner analytics");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      {/* Stats Section with Glowing Borders */}
      <div className="owner-stats">
        <div className="stat-card glow">
          <div className="stat-info">
            <h3>Revenue (Completed)</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <FiTrendingUp className="stat-icon" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Bookings Managed</h3>
            <p>{stats.totalBookings}</p>
          </div>
          <FiUsers className="stat-icon" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Active Hostels Listed</h3>
            <p>{stats.hostelCount}</p>
          </div>
          <FiHome className="stat-icon" />
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="recent-section">
          <h2>Recent Activity</h2>
          <div className="activity-item">
            <div className="activity-text">
              <p>Rahul booked a bed at <strong>Sunrise PG</strong></p>
              <span>2 hours ago</span>
            </div>
            <span className="status new">New</span>
          </div>
          <div className="activity-item">
            <div className="activity-text">
              <p>New review received for <strong>City Stay</strong></p>
              <span>5 hours ago</span>
            </div>
            <span className="status review">Review</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="quick-actions-panel">
           <h2>Quick Actions</h2>
           <button className="action-btn primary" onClick={() => setActiveTab("addHostel")}><FiPlusSquare /> Add New Hostel</button>
           <button className="action-btn secondary" onClick={() => setActiveTab("bookings")}><FiBriefcase /> View All Bookings</button>
        </div>
      </div>
    </div>
  );
}

function AddHostelTab() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    type: "Boys",
    availableBeds: "",
    description: "",
    images: ""
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'images') payload.append(key, formData[key]);
      });
      images.forEach(img => payload.append('images', img));
      
      await addHostel(payload);
      toast.success("Property submitted successfully. Awaiting admin approval.");
      setFormData({ name: "", location: "", price: "", type: "Boys", availableBeds: "", description: "", images: "" });
      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add hostel. Verify your permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-property-wrapper">
      <div className="add-property-header">
        <h2>List a New Property</h2>
        <p>Complete the details below to add your premier property to our catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="owner-form modern-form">
        
        {/* Section 1 */}
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-group-modern">
              <label>Property Name</label>
              <div className="input-wrapper">
                <FiTag className="input-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. The Grand Residency" />
              </div>
            </div>

            <div className="form-group-modern">
              <label>Location (City)</label>
              <div className="input-wrapper">
                <FiMapPin className="input-icon" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Bangalore" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="form-section">
          <h3 className="section-title">Pricing & Capacity</h3>
          <div className="form-grid">
            <div className="form-group-modern">
              <label>Price per night (₹)</label>
              <div className="input-wrapper">
                <FiDollarSign className="input-icon" />
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 1500" />
              </div>
            </div>

            <div className="form-group-modern">
              <label>Total Available Beds</label>
              <div className="input-wrapper">
                <FiUsers className="input-icon" />
                <input type="number" name="availableBeds" value={formData.availableBeds} onChange={handleChange} required placeholder="e.g. 10" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="form-section">
          <h3 className="section-title">Property Details</h3>
          <div className="form-group-modern">
            <label>Property Orientation</label>
            <div className="input-wrapper select-wrapper">
              <FiInfo className="input-icon" />
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
                <option value="Coed">Co-ed</option>
              </select>
            </div>
          </div>

          <div className="form-group-modern">
            <label>Description & Premium Amenities</label>
            <div className="input-wrapper align-top">
              <FiAlignLeft className="input-icon textarea-icon" />
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required placeholder="Describe the exclusive amenities and vibe..."></textarea>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="form-section">
          <h3 className="section-title">Media</h3>
          <div className="form-group-modern">
            <label>Upload Property Images</label>
            <div className="input-wrapper">
              <FiImage className="input-icon" />
              <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} />
            </div>
            <span className="helper-text">Select high quality images for the best presentation. Maximum 5MB per file.</span>
          </div>
        </div>

        <button type="submit" className="submit-btn gradient-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner-small"></span> : "Launch Property"}
        </button>
      </form>
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../Services/api").then(({ getOwnerBookings }) => {
      getOwnerBookings()
        .then(res => setBookings(res.data))
        .catch(err => toast.error(err.response?.data?.message || "Failed to load live bookings"))
        .finally(() => setLoading(false));
    });
  }, []);

  const handleCheckout = (id) => {
    import("../../Services/api").then(({ markCheckout }) => {
      markCheckout(id).then(() => {
        toast.success("Guest successfully checked-out. Automated notification sent to their dashboard!");
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'completed' } : b));
      }).catch(err => toast.error("Failed to process checkout."));
    });
  };

  if (loading) return <p style={{ color: "var(--text-muted)", marginTop: "40px", marginLeft: '20px' }}>Tracking active reservations...</p>;

  return (
    <div className="bookings-container">
      <h2 style={{ marginBottom: '20px', color: 'var(--text-main)', fontWeight: 300 }}>Active Bookings Matrix</h2>
      
      {bookings.length === 0 ? (
        <p style={{ color: "var(--text-muted)", marginTop: "20px" }}>No reservations require attention.</p>
      ) : (
        <div className="booking-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map(booking => (
            <div key={booking._id} className="stat-card" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="activity-text">
                <p style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>{booking.user?.name || 'Guest'}</p>
                <p><strong>Property:</strong> {booking.hostel?.name}</p>
                <span><strong>Timeline:</strong> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                <p style={{ marginTop: '5px' }}><strong>Status:</strong> <span style={{ color: booking.status === 'completed' ? '#38bdf8' : booking.status === 'cancelled' ? '#f87171' : '#fbbf24' }}>{booking.status.toUpperCase()}</span></p>
              </div>
              <div className="quick-actions-panel" style={{ background: 'transparent', padding: 0, border: 'none', flexDirection: 'row' }}>
                {booking.status === 'confirmed' || booking.status === 'pending' ? (
                  <button className="action-btn primary" style={{ padding: '10px 18px', borderRadius: '8px' }} onClick={() => handleCheckout(booking._id)}>Mark Checked-Out</button>
                ) : (
                  <span style={{ color: 'var(--text-muted)', padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>LOCKED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageHostelsTab() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import dynamically to patch without circular dependency top load
    import("../../Services/api").then(({ getOwnerHostels }) => {
      getOwnerHostels()
        .then(res => setHostels(res.data))
        .catch(err => toast.error("Failed to load your properties"))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="manage-container" style={{ padding: '20px 0' }}>
      <h2 style={{ marginBottom: '30px', color: 'var(--text-main)', fontWeight: 300 }}>My Properties Catalog</h2>
      
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading catalog...</p>
      ) : hostels.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>You have not listed any properties yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {hostels.map(h => (
            <div key={h._id} className="ui-card" style={{ border: h.isApproved ? '1px solid #22c55e' : '1px solid #eab308' }}>
              <h3 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>{h.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px' }}>{h.location} • ₹{h.price}/night</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  background: h.isApproved ? '#22c55e20' : '#eab30820', 
                  color: h.isApproved ? '#22c55e' : '#eab308', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  fontWeight: 'bold' 
                }}>
                  {h.isApproved ? 'Approved & Live' : 'Pending Approval'}
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{h.availableBeds} Beds</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;