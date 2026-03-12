import "./HostelCard.css";

function HostelCard({ name, location, price, rating, image }) {
  return (
    <div className="ui-card ui-card-accent hostel-card">
      <img src={image} alt={name} className="hostel-image" />

      <div className="hostel-content">
        <h3>{name}</h3>
        <p className="location">{location}</p>

        <div className="hostel-bottom">
          <span className="price">₹{price}/month</span>
          <span className="rating">⭐ {rating}</span>
        </div>

        <button className="view-btn">View Details</button>
      </div>
    </div>
  );
}

export default HostelCard;