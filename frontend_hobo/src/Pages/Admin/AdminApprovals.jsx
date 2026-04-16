import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getPendingHostels, approveHostel, rejectHostel } from "../../Services/api";
import "./Admin.css";

function AdminApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await getPendingHostels();
        setApprovals(res.data);
      } catch (err) {
        toast.error("Failed to fetch pending approvals.");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "Approve") {
         await approveHostel(id);
         toast.success("Hostel approved and is now live!");
      } else {
         await rejectHostel(id);
         toast.error("Hostel rejected.");
      }
      setApprovals(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} hostel.`);
    }
  };

  return (
    <div className="moderation-container">
      <h1 style={{ marginBottom: "30px" }}>Pending Approvals</h1>

      {loading ? (
        <p style={{ color: "#a1a1aa" }}>Loading pending requests...</p>
      ) : approvals.length === 0 ? (
        <p style={{ color: "#a1a1aa" }}>No pending approvals right now.</p>
      ) : (
        <div className="moderation-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {approvals.map(item => (
            <div key={item._id} className="moderation-card" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: "12px", background: "var(--border-card)", padding: "4px 8px", borderRadius: "4px", marginBottom: "8px", display: "inline-block", fontWeight: "bold", textTransform: "uppercase" }}>Hostel Pending</span>
                  <h3 style={{ fontSize: "22px", marginBottom: "5px", color: "white" }}>{item.name}</h3>
                  <p style={{ color: "#d4af37", fontSize: "15px", fontWeight: "bold" }}>
                    📍 {item.location} • ₹{item.price} / night • 🛏 {item.availableBeds} beds
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Owner</p>
                  <p style={{ color: "#cbd5e1", fontSize: "14px", margin: "2px 0" }}>{item.owner?.name || "Unknown"}</p>
                  <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0" }}>{item.owner?.email || ""}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                {item.images?.length > 0 ? item.images.map((img, idx) => (
                  <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Hostel" style={{ height: '120px', minWidth: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                )) : <div style={{ height: '120px', width: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Images</div>}
              </div>

              <div>
                <h4 style={{ color: "var(--text-main)", marginBottom: "5px" }}>Description</h4>
                <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>{item.description || "No description provided."}</p>
              </div>

              {item.amenities?.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--text-main)", marginBottom: "8px" }}>Amenities</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {item.amenities.map((am, idx) => (
                       <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', color: '#cbd5e1' }}>✨ {am}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '10px' }}>
                <button onClick={() => handleAction(item._id, 'Approve')} style={{ background: '#10b981', color: 'white', border: '1px solid #10b981', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}>Approve Hostel</button>
                <button onClick={() => handleAction(item._id, 'Reject')} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApprovals;
