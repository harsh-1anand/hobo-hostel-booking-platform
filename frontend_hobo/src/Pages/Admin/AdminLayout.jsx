import { Outlet } from "react-router-dom";
import "./Admin.css";

function AdminLayout() {
  return (
    <div className="admin-page">
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
