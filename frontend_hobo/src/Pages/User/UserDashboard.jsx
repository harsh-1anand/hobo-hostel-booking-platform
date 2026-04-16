import { useState, useEffect } from "react";
import { getHostels, getWishlist, getMyBookingsCategorized, updateProfile } from "../../Services/api";
import HostelCard from "../../Components/HostelCard/Hostelcard";
import HostelSkeleton from "../../Components/HostelCard/HostelSkeleton";
import { toast } from "react-hot-toast";
import "./User.css";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <div className="dashboard-main">
      <div className="user-tabs" style={{ display: 'flex', gap: '20px', padding: '20px 40px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-card)', justifyContent: 'center' }}>
        <button style={tabStyle(activeTab === 'explore')} onClick={() => setActiveTab("explore")}>Explore</button>
        <button style={tabStyle(activeTab === 'wishlist')} onClick={() => setActiveTab("wishlist")}>Wishlist</button>
        <button style={tabStyle(activeTab === 'profile')} onClick={() => setActiveTab("profile")}>My Bookings & Profile</button>
      </div>

      <div style={{ minHeight: '80vh' }}>
        {activeTab === "explore" && <ExploreTab />}
        {activeTab === "wishlist" && <WishlistTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

const tabStyle = (isActive) => ({
  background: isActive ? 'var(--accent)' : 'transparent',
  color: isActive ? 'black' : 'var(--text-main)',
  padding: '10px 20px',
  border: isActive ? 'none' : '1px solid var(--border-card)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
});

function ExploreTab() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [search, setSearch] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  
  // Amenities
  const [amenities, setAmenities] = useState({ Wifi: false, AC: false, Breakfast: false });

  const fetchHostels = async () => {
    setLoading(true);
    try {
      // Build amenity array
      const selectedAmenities = Object.keys(amenities).filter(k => amenities[k]);
      
      const params = {
        search,
        minPrice,
        maxPrice,
        minRating,
        sort: sortOrder,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined
      };
      
      const res = await getHostels(params);
      setHostels(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [sortOrder]); // Auto-fetch when sort changes

  const handleSearch = () => {
    fetchHostels();
  };

  const toggleAmenity = (name) => {
    setAmenities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <div className="hero-container">
        <h1>Find Your Perfect Stay</h1>

        <div className="search-bar" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="search-item" style={{ flex: '1 1 200px' }}>
            <label>Location / Name</label>
            <input type="text" placeholder="Enter city or area" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          
          <div className="search-item" style={{ flex: '1 1 120px' }}>
             <label>Min Price</label>
             <input type="number" placeholder="₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>

          <div className="search-item" style={{ flex: '1 1 120px' }}>
             <label>Max Price</label>
             <input type="number" placeholder="₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>

          <div className="search-item" style={{ flex: '1 1 120px' }}>
             <label>Min Rating</label>
             <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={{ padding: '10px', background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}>
               <option value="" style={{color: 'black'}}>Any</option>
               <option value="3" style={{color: 'black'}}>3+ Stars</option>
               <option value="4" style={{color: 'black'}}>4+ Stars</option>
             </select>
          </div>

          <button className="search-btn" onClick={handleSearch} style={{ flex: '1 1 100%' }}>Deep Search</button>
        </div>
        
        {/* Amenities Bar */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
           {['Wifi', 'AC', 'Breakfast'].map(am => (
             <label key={am} style={{ color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
               <input type="checkbox" checked={amenities[am]} onChange={() => toggleAmenity(am)} /> {am}
             </label>
           ))}
        </div>
      </div>

      <div className="filters-bar" style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 40px', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>Sort By:</span>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <div className="hostels-grid">
        {loading ? (
          <><HostelSkeleton /><HostelSkeleton /><HostelSkeleton /><HostelSkeleton /></>
        ) : hostels.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px 0', color: 'var(--text-muted)' }}>
            <h2>No properties matched your criteria.</h2>
            <p>Try clearing filters or searching another city.</p>
          </div>
        ) : (
          hostels.map((hostel) => <HostelCard key={hostel._id} hostel={hostel} checkIn={checkIn} />)
        )}
      </div>
    </>
  );
}

function WishlistTab() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const res = await getWishlist();
        setWishlist(res.data);
      } catch(err) {
        toast.error("Could not load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWish();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '30px', color: 'var(--text-main)' }}>Your Saved Properties</h1>
      <div className="hostels-grid">
        {loading ? <p style={{color:'white'}}>Loading wishlist...</p> : 
         wishlist.length === 0 ? <p style={{color: 'var(--text-muted)'}}>Your wishlist is empty.</p> :
         wishlist.map((hostel) => <HostelCard key={hostel._id} hostel={hostel} />)
        }
      </div>
    </div>
  );
}

function ProfileTab() {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState({ phone: '', bio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Import getUserProfile dynamically to avoid circular dependency issues at the top of an already parsed file
    import("../../Services/api").then(({ getMyBookingsCategorized, getUserProfile }) => {
      const init = async () => {
        try {
          const [bookRes, userRes] = await Promise.all([
             getMyBookingsCategorized(),
             getUserProfile()
          ]);
          setBookings(bookRes.data);
          setUserData(userRes.data);
          setProfile({ phone: userRes.data.phone || '', bio: userRes.data.bio || '' });
        } catch(err) {
          toast.error("Failed to load profile data");
        }
      };
      init();
    });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { updateProfile } = await import("../../Services/api");
      await updateProfile(profile);
      toast.success("Profile Updated");
    } catch(err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
       {/* Profile Editor & Details */}
       <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
         <div className="ui-card">
           <h2 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Account Details</h2>
           {userData ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)', fontSize: '15px' }}>
               <p><strong style={{color:'white'}}>First Name:</strong> {userData.firstName || '-'}</p>
               <p><strong style={{color:'white'}}>Last Name:</strong> {userData.lastName || '-'}</p>
               <p><strong style={{color:'white'}}>Email:</strong> {userData.email}</p>
               <p><strong style={{color:'white'}}>Mobile:</strong> {userData.mobile || '-'}</p>
               <p><strong style={{color:'white'}}>DOB:</strong> {userData.dob ? new Date(userData.dob).toLocaleDateString() : '-'}</p>
               <p><strong style={{color:'white'}}>Role(s):</strong> <span style={{ textTransform: 'uppercase' }}>{userData.role}</span></p>
             </div>
           ) : <p style={{color: 'var(--text-muted)'}}>Loading account...</p>}
         </div>

         <div className="ui-card">
           <h2 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Public Preferences</h2>
           <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '5px', display: 'block' }}>Alternate Phone</label>
                <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)' }} placeholder="Optional alternative contact" />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '5px', display: 'block' }}>Bio</label>
                <textarea rows="4" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)' }} placeholder="Tell us about your travels..."></textarea>
              </div>
              <button type="submit" disabled={saving} style={{ background: 'var(--accent)', color: 'black', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                 {saving ? 'Saving...' : 'Save Preferences'}
              </button>
           </form>
         </div>
       </div>

       {/* Bookings Tracker */}
       <div style={{ flex: '2 1 500px' }}>
         <h2 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Upcoming Bookings</h2>
         {bookings.upcoming.length === 0 ? <p style={{color: 'var(--text-muted)'}}>No upcoming trips.</p> : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {bookings.upcoming.map(b => (
               <div key={b._id} className="ui-card" style={{ borderLeft: '4px solid #22c55e' }}>
                 <h3 style={{color:'white'}}>{b.hostel?.name || 'Unknown Property'}</h3>
                 <p style={{color:'#a1a1aa', fontSize:'14px', margin: '5px 0'}}>Check-in: {new Date(b.checkIn).toLocaleDateString()}</p>
                 <span style={{ fontSize: '12px', background: '#22c55e20', color: '#22c55e', padding: '4px 8px', borderRadius: '4px' }}>{b.status}</span>
               </div>
             ))}
           </div>
         )}

         <h2 style={{ margin: '40px 0 20px 0', color: 'var(--text-main)' }}>Past Bookings</h2>
         {bookings.past.length === 0 ? <p style={{color: 'var(--text-muted)'}}>No past trips.</p> : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {bookings.past.map(b => (
               <div key={b._id} className="ui-card" style={{ borderLeft: '4px solid #a1a1aa' }}>
                 <h3 style={{color:'white'}}>{b.hostel?.name || 'Unknown Property'}</h3>
                 <p style={{color:'#a1a1aa', fontSize:'14px', margin: '5px 0'}}>Checked-out: {new Date(b.checkOut).toLocaleDateString()}</p>
                 <span style={{ fontSize: '12px', background: '#3f3f46', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px' }}>{b.status}</span>
               </div>
             ))}
           </div>
         )}
       </div>
    </div>
  );
}

export default UserDashboard;