import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    const fakeUser = { name: "Harsh", role: "admin" }; // change role to test
    login(fakeUser);

    if (fakeUser.role === "admin") navigate("/admin");
    if (fakeUser.role === "owner") navigate("/owner");
    if (fakeUser.role === "user") navigate("/user");
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login as Demo</button>
    </div>
  );
}

export default Login;