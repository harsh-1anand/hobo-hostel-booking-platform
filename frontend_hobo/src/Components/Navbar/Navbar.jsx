import "./Navbar.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { useThemeStore } from "../../store/useThemeStore.js";
import Sidebar from "../Sidebar/Sidebar.jsx";

function Navbar({ isDashboard, showCities }) {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const cities = [
    {
      name: "Noida",
      locations: ["Sector 18", "Sector 62", "Sector 137"]
    },
    {
      name: "Kota",
      locations: ["Talwandi", "Vigyan Nagar", "Mahaveer Nagar"]
    },
    {
      name: "Patna",
      locations: ["Boring Road", "Patliputra", "Rajendra Nagar"]
    },
    {
      name: "Udaipur",
      locations: ["Fateh Sagar", "Hiran Magri", "Pratap Nagar"]
    }
  ];

  const [hoverCity, setHoverCity] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Silently reload alerts if user navigates dynamically around dashboards
  useEffect(() => {
    if (localStorage.getItem('token')) {
      import("../../Services/api").then(({ getMyNotifications }) => {
        getMyNotifications().then(res => setNotifications(res.data)).catch(() => {});
      });
    }
  }, [location.pathname]); 

  const handleRead = (n) => {
    import("../../Services/api").then(({ markNotificationRead }) => {
      markNotificationRead(n._id);
      setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, read: true } : x));
      setShowNotifications(false);
      if (n.link) navigate(n.link);
    });
  };

  let menuTimeout;

  const handleMenuEnter = () => {
    clearTimeout(menuTimeout);
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuTimeout = setTimeout(() => setMenuOpen(false), 200);
  };

  const handleLogout = () => {
    logout();
    import("react-hot-toast").then((module) => {
      module.toast.success("Logged out successfully");
    });
    navigate("/login");
  };

  const getMenuItems = () => {
    const path = location.pathname;
    if (path.startsWith("/owner")) {
      return [
        { name: "Dashboard", action: () => navigate("/owner?tab=overview") },
        { name: "My Hostels", action: () => navigate("/owner?tab=manage") },
        { name: "Bookings", action: () => navigate("/owner?tab=bookings") },
        { name: "Add Hostel", action: () => navigate("/owner?tab=addHostel") }
      ];
    }
    if (path.startsWith("/admin")) {
      return [
        { name: "Dashboard", action: () => navigate("/admin/dashboard") },
        { name: "Moderation (Approvals)", action: () => navigate("/admin/approvals") },
        { name: "Manage Users", action: () => navigate("/admin/users") },
        { name: "Manage Owners", action: () => navigate("/admin/owners") },
        { name: "Manage Hostels", action: () => navigate("/admin/hostels") },
        { name: "Reports", action: () => navigate("/admin/reports") }
      ];
    }
    if (path.startsWith("/user")) {
      return [
        { name: "Dashboard", action: () => navigate("/user") },
        { name: "My Bookings", action: () => navigate("/user/bookings") }
      ];
    }
    return [];
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        {isDashboard && (
          <>
            <div
              className="menu-icon"
              onClick={() => setMenuOpen(true)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </div>

            <Sidebar
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              menuItems={getMenuItems()}
              onLogout={handleLogout}
            />
          </>
        )}
        <h2 style={{ marginLeft: isDashboard ? '20px' : '0' }}>HOBO</h2>
      </div>

      {showCities && (
        <div className="city-links">
          {cities.map((city) => (
            <div
              key={city.name}
              className="city-item"
              onMouseEnter={() => setHoverCity(city.name)}
              onMouseLeave={() => setHoverCity(null)}
            >
              <div>{city.name}</div>
              {hoverCity === city.name && (
                <div className="dropdown">
                  {city.locations.map((loc) => (
                    <p key={loc}>{loc}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Notification Bell Layer */}
        {localStorage.getItem('token') && (
           <div style={{ position: 'relative', cursor: 'pointer' }}>
             <button style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32 32h384c19.02 0 31.89-15.6 32-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>
                {notifications.some(n => !n.read) && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', height: '10px', width: '10px', background: '#ef4444', borderRadius: '50%' }}></span>
                )}
             </button>
             {showNotifications && (
               <div style={{ position: 'absolute', right: '-10px', top: '40px', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '15px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                 <h4 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Notifications</h4>
                 {notifications.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>You have no new alerts.</p> : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                     {notifications.map(n => (
                       <div key={n._id} onClick={() => handleRead(n)} style={{ padding: '12px', background: n.read ? 'transparent' : 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: '0.2s', textAlign: 'left' }}>
                         <p style={{ color: n.read ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '13px', lineHeight: '1.5' }}>{n.message}</p>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             )}
           </div>
        )}

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>
      </div>
    </div>
  );
}

export default Navbar;