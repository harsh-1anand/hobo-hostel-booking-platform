import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Protected Route Wrapper</h2>
      <p>User: {user ? "Logged In" : "Not Logged In"}</p>
      {children}
    </div>
  );
};

export default ProtectedRoute;