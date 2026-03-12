import "./User.css";

function UserDashboard() {
  return (
    <>
      {/* Main Content Only */}
      <div className="dashboard-main">

        <div className="hero-container">
          <h1>Find Your Perfect Stay</h1>

          <div className="search-bar">

            <div className="search-item">
              <label>Location</label>
              <input type="text" placeholder="Enter city or area" />
            </div>

            <div className="search-item">
              <label>Check In</label>
              <input type="date" />
            </div>

            <div className="search-item">
              <label>Guests</label>
              <input type="number" placeholder="1 Guest" />
            </div>

            <button className="search-btn">Search</button>

          </div>
        </div>

      </div>
    </>
  );
}

export default UserDashboard;