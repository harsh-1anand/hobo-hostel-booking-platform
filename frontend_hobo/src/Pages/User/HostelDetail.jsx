import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHostel, createBooking, checkAvailability, getHostelReviews, addReview, toggleWishlist, getMyBookings } from "../../Services/api";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./HostelDetail.css";

function HostelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hostel, setHostel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Booking state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dynamicCapacity, setDynamicCapacity] = useState(null);
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewing, setReviewing] = useState(false);
  
  const ratingTexts = ["Select Rating", "😡 Poor", "😐 Fair", "🙂 Good", "😍 Very Good", "🤩 Excellent"];

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [res, revs, bookingsRes] = await Promise.all([
          getHostel(id), 
          getHostelReviews(id),
          getMyBookings()
        ]);
        
        setHostel(res.data);
        setReviews(revs.data);
        
        const _hasCompleted = bookingsRes.data.some(b => b.hostel?._id === id && b.status === "completed");
        setHasCompletedBooking(_hasCompleted);
        
        const _hasReviewed = revs.data.some(r => r.userId?._id === user?._id);
        setHasReviewed(_hasReviewed);
        
      } catch (err) {
        toast.error("Failed to load hostel details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, user?._id]);

  useEffect(() => {
    // Dynamic Booking Availability Check
    if (checkIn && checkOut) {
      const checkInOut = async () => {
        try {
          const res = await checkAvailability(id, checkIn, checkOut);
          setDynamicCapacity(res.data.availableBeds);
        } catch (err) {
          console.error("Availability check failed", err);
        }
      };
      checkInOut();
    } else {
      setDynamicCapacity(null);
    }
  }, [checkIn, checkOut, id]);

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      return toast.error("Please select dates");
    }
    if (dynamicCapacity === 0) {
      return toast.error("Sold out for these exact dates. Try different dates.");
    }

    try {
      const res = await createBooking({ hostel: id, checkIn, checkOut });
      toast.success("Dates secured! Redirecting to checkout...");
      navigate("/user/payment/" + res.data._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewing(true);
    try {
      const res = await addReview({ hostelId: id, rating, comment });
      setReviews(prev => [...prev, res.data]);
      setHasReviewed(true);
      toast.success("Review published!");
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setReviewing(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await toggleWishlist(id);
      toast.success("Wishlist toggled!");
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) return <div className="detail-loading" style={{textAlign: "center", marginTop: "50px", color: 'var(--text-main)'}}>Loading immersive details...</div>;
  if (!hostel) return <div className="detail-error" style={{textAlign: "center", marginTop: "50px", color: 'var(--text-main)'}}>Hostel not found.</div>;

  return (
    <div className="hostel-detail-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <button onClick={handleWishlist} style={{ background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>❤️ Save to Wishlist</button>
      </div>

      <div className="detail-header">
        <h1>{hostel.name}</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
          <p className="location-badge">📍 {hostel.location}</p>
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {hostel.averageRating?.toFixed(1) || 'NEW'} ({hostel.reviewCount} Reviews)</span>
        </div>
      </div>

      <div className="images-gallery">
        {hostel.images?.length > 0 ? (
          hostel.images.map((img, idx) => (
            <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt={`${hostel.name} ${idx}`} className="gallery-img" />
          ))
        ) : (
          <div className="no-image-large">Spectacular Views Await (Images incoming)</div>
        )}
      </div>

      <div className="detail-content">
        <div className="info-section">
          <h2>About this stay</h2>
          <p>{hostel.description || "A cozy stay for backpackers and travelers. Enjoy your time meeting new people and creating lifelong memories in our wonderful community space!"}</p>
          
          <div className="amenities">
            <h3>Premium Amenities</h3>
            <ul>
              {hostel.amenities?.length > 0 ? hostel.amenities.map((am, i) => <li key={i}>✨ {am}</li>) : (
                <>
                  <li>📶 Free High-Speed Wi-Fi</li>
                  <li>🍳 Breakfast Included</li>
                  <li>❄️ Air Conditioning</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Reviews Rendering Region */}
          <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-card)', paddingTop: '40px' }}>
             <h2 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Guest Reviews</h2>
             {reviews.length === 0 ? (
               <div className="empty-reviews">
                 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 22.7 481.1 22 483.5c-1.3 4.2-.8 8.8 1.5 12.5S29 501.7 33.5 502c34.9 2.5 125.6-11.6 182-41.5 13.1 1.7 26.6 2.5 40.5 2.5 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                 <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No reviews yet</h3>
                 <p style={{ color: 'var(--text-muted)' }}>Be the first to share your experience with the community!</p>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map(r => (
                    <div key={r._id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                         <strong style={{ color: 'var(--text-main)' }}>{r.userId?.name || 'Guest'}</strong>
                         <span style={{ color: '#fbbf24' }}>{"★".repeat(r.rating)}</span>
                       </div>
                       <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{r.comment}</p>
                    </div>
                  ))}
               </div>
             )}

             {/* Review Form Validation Gate */}
             {hasReviewed ? (
               <div className="my-review-card">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                   <div style={{ background: '#10b981', color: 'black', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                   <h3 style={{ color: '#10b981', margin: 0 }}>Thank you for your feedback!</h3>
                 </div>
                 <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontStyle: 'italic' }}>"{reviews.find(r => r.userId?._id === user?._id)?.comment}"</p>
                 <div style={{ marginTop: '10px', color: '#fbbf24', fontSize: '18px' }}>
                   {"★".repeat(reviews.find(r => r.userId?._id === user?._id)?.rating || 5)}
                 </div>
               </div>
             ) : hasCompletedBooking ? (
               <div className="review-form-container">
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '22px' }}>Rate your stay</h3>
                  <form onSubmit={submitReview}>
                     
                     <div className="star-rating-container">
                       <div className="stars-wrapper">
                         {[1, 2, 3, 4, 5].map(star => (
                           <span 
                             key={star}
                             className={`star-icon ${star <= (hoverRating || rating) ? 'active' : ''}`}
                             onMouseEnter={() => setHoverRating(star)}
                             onMouseLeave={() => setHoverRating(0)}
                             onClick={() => setRating(star)}
                           >
                             ★
                           </span>
                         ))}
                       </div>
                       <div className="rating-text">
                         {ratingTexts[hoverRating || rating]}
                       </div>
                     </div>

                     <textarea 
                       className="review-textarea"
                       value={comment} 
                       onChange={e=>setComment(e.target.value)} 
                       placeholder="Tell us about your experience... Cleanliness, staff behavior, location, vibe?" 
                       required 
                     ></textarea>
                     
                     <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                       <button type="submit" className="submit-review-btn" disabled={reviewing || rating === 0}>
                         {reviewing ? <span className="spinner-small"></span> : (rating === 0 ? 'Select a Rating' : 'Post Review')}
                       </button>
                     </div>
                  </form>
               </div>
             ) : (
               <div style={{ marginTop: '40px', background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border-card)', textAlign: 'center' }}>
                 <p style={{ color: 'var(--text-muted)' }}>🔒 You can only write a review once you have completed a verified stay at this property.</p>
               </div>
             )}
          </div>

        </div>

        <div className="booking-card ui-card" style={{ position: 'sticky', top: '100px' }}>
          <h2>₹{hostel.price} <span>/ night</span></h2>
          
          {/* Dynamic Tracker */}
          {dynamicCapacity !== null ? (
            <p style={{ color: dynamicCapacity > 0 ? '#22c55e' : '#ef4444', marginBottom: "15px", fontWeight: "600" }}>
               {dynamicCapacity > 0 ? `${dynamicCapacity} beds dynamically verified available!` : 'Sold Out for these dates'}
            </p>
          ) : (
            <p style={{ color: "var(--accent)", marginBottom: "15px", fontWeight: "600" }}>Base capacity: {hostel.availableBeds} beds</p>
          )}

          <div className="date-picker-group">
            <div className="date-field">
              <label>Check In</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="date-field">
              <label>Check Out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>
          
          <button 
             className="primary-btn full-width" 
             onClick={handleBook}
             disabled={dynamicCapacity === 0}
             style={{ opacity: dynamicCapacity === 0 ? 0.5 : 1, cursor: dynamicCapacity === 0 ? 'not-allowed' : 'pointer' }}
          >
            {dynamicCapacity === 0 ? 'Capacity Reached' : 'Secure Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HostelDetail;
