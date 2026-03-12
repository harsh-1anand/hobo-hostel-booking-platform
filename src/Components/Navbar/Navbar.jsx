import "./Navbar.css";
import { useState } from "react";

function Navbar({ showCities }) {
  const cities = ["Noida", "Kota", "Patna", "Udaipur"];
  const [hoverCity, setHoverCity] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar">

      {/* Left Section */}
      <div className="nav-left">
        {showCities && (
          <div
            className="menu-icon"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰

            {menuOpen && (
              <div className="menu-dropdown">
                <p>Dashboard</p>
                <p>My Bookings</p>
                <p>Profile</p>
                <p>Logout</p>
              </div>
            )}
          </div>
        )}

        <h2>HOBO</h2>
      </div>

      {/* Cities Section */}
      {showCities && (
        <div className="city-links">
          {cities.map((city) => (
            <div
              key={city}
              className="city-item"
              onMouseEnter={() => setHoverCity(city)}
              onMouseLeave={() => setHoverCity(null)}
            >
             <div className="city-item">{city}</div>

              {hoverCity === city && (
                <div className="dropdown">
                  <p>Location 1</p>
                  <p>Location 2</p>
                  <p>Location 3</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Navbar;