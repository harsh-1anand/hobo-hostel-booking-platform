import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, onClose, menuItems, onLogout }) {
  return (
    <>
      <div className={`nav-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <h2>HOBO <span className="gold-accent">Menu</span></h2>
          <svg onClick={onClose} className="close-btn" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <ul className="sidebar-nav">
          {menuItems.map((item, index) => (
            <li key={index} onClick={() => { item.action(); onClose(); }}>
              {item.name}
            </li>
          ))}
          <div className="sidebar-divider"></div>
          <li className="logout" onClick={() => { onLogout(); onClose(); }}>Logout</li>
        </ul>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
}

export default Sidebar;
