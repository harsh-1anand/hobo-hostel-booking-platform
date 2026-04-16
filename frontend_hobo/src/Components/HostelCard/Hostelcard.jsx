import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../Services/api";
import "./HostelCard.css";

function HostelCard({ hostel, checkIn }) {
  const [booking, setBooking] = useState(false);
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      setMessage("Select check-in & check-out.");
      return;
    }
    try {
      await createBooking({ hostelId: hostel._id, checkInDate: checkIn, checkOutDate: checkOut });
      setMessage("✅ Booking successful!");
      // Optionally redirect after a few seconds
      setTimeout(() => navigate('/user/bookings'), 2000);
    } catch (err) {
      setMessage("❌ Booking failed.");
    }
  };

  return (
    <div className="ui-card ui-card-accent hostel-card">
      <div 
        style={{ cursor: "pointer" }} 
        onClick={() => navigate(`/user/hostel/${hostel._id}`)}
      >
        {hostel.images?.[0] ? (
          <img src={hostel.images[0].startsWith('http') ? hostel.images[0] : `http://localhost:5000${hostel.images[0]}`} alt={hostel.name} className="hostel-image" />
        ) : (
          <div className="hostel-image no-image">No Image</div>
        )}

        <div className="hostel-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <h3 style={{ margin: 0 }}>{hostel.name}</h3>
            {hostel.reviewCount > 0 ? (
              <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}>
                🌟 {hostel.averageRating?.toFixed(1)} ({hostel.reviewCount})
              </span>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>NEW</span>
            )}
          </div>
          <p className="location">{hostel.location}</p>

          <div className="hostel-bottom">
            <span className="price">₹{hostel.price}/night</span>
            <span className="beds">🛏 {hostel.availableBeds} beds left</span>
          </div>
        </div>
      </div>
      
      <div className="hostel-actions" style={{ padding: "0 15px 15px" }}>
        {!booking ? (
          <button className="view-btn" onClick={() => setBooking(true)}>Quick Book</button>
        ) : (
          <div className="booking-form">
            <input
              type="date"
              placeholder="Check Out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <button className="view-btn" onClick={handleBook}>Confirm</button>
            <button className="cancel-btn" onClick={() => setBooking(false)}>Cancel</button>
          </div>
        )}

        {message && <p className="booking-msg">{message}</p>}
      </div>
    </div>
  );
}

export default HostelCard;