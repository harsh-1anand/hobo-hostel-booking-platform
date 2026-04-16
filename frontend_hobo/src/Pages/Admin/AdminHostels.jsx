import { useState, useEffect } from "react";
import { getAdminHostels } from "../../Services/api";
import { toast } from "react-hot-toast";

function AdminHostels() {
  const [hostels, setHostels] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // empty means all
  const [loading, setLoading] = useState(true);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset pagination on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on status change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    const fetchHostels = async () => {
      setLoading(true);
      try {
        const res = await getAdminHostels({ page, limit: 10, search: debouncedSearch, status: statusFilter });
        setHostels(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        toast.error("Failed to fetch hostels.");
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, [page, debouncedSearch, statusFilter]);

  return (
    <div className="admin-page-content" style={{ padding: '0 20px' }}>
      <h1 className="section-title">Manage Hostels</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by name or city..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', width: '300px' }}
        />
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', outline: 'none' }}
        >
           <option value="">All Statuses</option>
           <option value="approved">Live</option>
           <option value="pending">Pending</option>
        </select>
      </div>

      <div className="table-container" style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', color: '#cbd5e1' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>City</th>
              <th style={{ padding: '16px' }}>Price</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>Loading hostels...</td></tr>
            ) : hostels.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>No hostels found.</td></tr>
            ) : (
              hostels.map(hostel => (
                <tr key={hostel._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px', color: 'white', fontWeight: 'bold' }}>{hostel.name}</td>
                  <td style={{ padding: '16px', color: '#cbd5e1' }}>{hostel.location}</td>
                  <td style={{ padding: '16px', color: '#d4af37' }}>₹{hostel.price} / night</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      background: hostel.isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: hostel.isApproved ? '#10b981' : '#ef4444' 
                    }}>
                      {hostel.isApproved ? 'Live' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#94a3b8' }}>{hostel.owner?.name || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingBottom: '40px' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >Previous</button>
          <span style={{ color: '#cbd5e1' }}>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >Next</button>
        </div>
      )}
    </div>
  );
}

export default AdminHostels;
