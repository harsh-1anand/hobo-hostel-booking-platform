import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, updateBookingPayment } from "../../Services/api";
import { toast } from "react-hot-toast";
import "./PaymentPage.css";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("Pay Now");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(id);
        setBooking(res.data);
      } catch (err) {
        toast.error("Failed to load booking details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  const handleConfirm = async () => {
    setProcessing(true);

    try {
      if (method === "Pay Now") {
        // Simulate gateway latency
        await new Promise(r => setTimeout(r, 1500));
        await updateBookingPayment(id, { paymentMethod: "Pay Now", paymentStatus: "Completed" });
        toast.success("Payment successful! Booking securely vaulted.");
      } else {
        await updateBookingPayment(id, { paymentMethod: "Pay at Check-in", paymentStatus: "Pending" });
        toast.success("Booking confirmed! Please pay upon arrival.");
      }
      
      navigate("/user?tab=profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to finalize booking");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{textAlign: "center", marginTop: "100px", color: "white"}}>Securely bridging payment gateways...</div>;
  if (!booking || !booking.hostel) return null;

  const checkInDate = new Date(booking.checkIn).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString();
  const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)) || 1;
  const basePrice = booking.totalPrice;
  const taxes = Math.round(basePrice * 0.12); // Simulated GST
  const grandTotal = basePrice + taxes;

  return (
    <div className="payment-page-wrapper">
      <h1 style={{ marginBottom: '10px' }}>Secure Checkout</h1>
      <div className="secure-tag">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>
        <span>256-bit TLS Encrypted</span>
      </div>

      <div className="payment-container">
        
        {/* Left Column: Payment Modules */}
        <div className="payment-options-col">
          <div className="payment-toggle">
            <button className={`pay-btn ${method === 'Pay Now' ? 'active' : ''}`} onClick={() => setMethod('Pay Now')}>
              Pay Now
            </button>
            <button className={`pay-btn ${method === 'Pay at Check-in' ? 'active' : ''}`} onClick={() => setMethod('Pay at Check-in')}>
              Pay at Check-in
            </button>
          </div>

          <div className="payment-portal">
            {method === "Pay Now" ? (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <h3 style={{ color: 'white', marginBottom: '15px' }}>Card Details</h3>
                <input type="text" className="fake-input" placeholder="Card Number (0000 0000 0000 0000)" />
                <div className="flex-inputs">
                  <input type="text" className="fake-input" placeholder="MM/YY" />
                  <input type="text" className="fake-input" placeholder="CVC" />
                </div>
                <input type="text" className="fake-input" placeholder="Cardholder Name" />
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '10px' }}>ⓘ This is a mock integration. No real funds are captured.</p>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s ease-in', textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏨</div>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>Skip Online Payment</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  Your booking will be confirmed immediately. You will settle the grand total of <strong>₹{grandTotal}</strong> in local currency or card directly at the reception desk upon your arrival.
                </p>
              </div>
            )}
          </div>

          <button 
             onClick={handleConfirm} 
             disabled={processing}
             className="primary-btn" 
             style={{ padding: '16px', fontSize: '16px', marginTop: '10px', opacity: processing ? 0.7 : 1 }}
          >
            {processing ? "Processing Transcation..." : method === "Pay Now" ? `Pay ₹${grandTotal} Securely` : "Confirm Request"}
          </button>
        </div>

        {/* Right Column: Order Summary */}
        <div className="payment-details-col">
          <div className="ui-card summary-card">
            <h2>{booking.hostel.name}</h2>
            <p className="hostel-address">📍 {booking.hostel.location}</p>

            <div className="booking-snapshot">
               <div className="snapshot-item">
                 <span>Check In</span>
                 <strong>{checkInDate}</strong>
               </div>
               <div className="snapshot-item" style={{ textAlign: "right" }}>
                 <span>Check Out</span>
                 <strong>{checkOutDate}</strong>
               </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Base ({nights} nights)</span>
                <span>₹{basePrice}</span>
              </div>
              <div className="price-row">
                <span>Taxes & Fees (12%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px' }}>
               <h4 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '14px' }}>Free Cancellation</h4>
               <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>Cancel up to 24 hours before check-in for a full refund. House rules strictly apply.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PaymentPage;
