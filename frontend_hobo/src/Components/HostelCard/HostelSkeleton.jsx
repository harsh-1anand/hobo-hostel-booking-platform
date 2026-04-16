import "./HostelSkeleton.css";

function HostelSkeleton() {
  return (
    <div className="ui-card hostel-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="hostel-content" style={{ padding: '20px' }}>
        <div className="skeleton-line title-line"></div>
        <div className="skeleton-line location-line"></div>
        <div className="skeleton-line price-line"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
}

export default HostelSkeleton;
