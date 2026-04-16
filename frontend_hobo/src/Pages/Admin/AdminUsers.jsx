import { useState, useEffect } from "react";
import { getAdminUsers } from "../../Services/api";
import { toast } from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset pagination on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAdminUsers({ page, limit: 10, search: debouncedSearch, role: 'user' });
        setUsers(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, debouncedSearch]);

  return (
    <div className="admin-page-content" style={{ padding: '0 20px' }}>
      <h1 className="section-title">Manage Users</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', width: '300px' }}
        />
      </div>

      <div className="table-container" style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', color: '#cbd5e1' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Email</th>
              <th style={{ padding: '16px' }}>Phone</th>
              <th style={{ padding: '16px' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px', color: 'white' }}>{user.name}</td>
                  <td style={{ padding: '16px', color: '#cbd5e1' }}>{user.email}</td>
                  <td style={{ padding: '16px', color: '#cbd5e1' }}>{user.phone || 'N/A'}</td>
                  <td style={{ padding: '16px', color: '#94a3b8' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
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

export default AdminUsers;
