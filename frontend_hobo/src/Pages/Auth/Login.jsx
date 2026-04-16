import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { loginUser } from "../../Services/api";
import { AuthContext } from "../../Context/AuthContext";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name || "to HOBO"}`);
      
      const userRole = res.data.user.role || "user";
      navigate(`/${userRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-cover">
        <div className="cover-quote">
          <h1>Experience world-class luxury<br/>at hostel prices.</h1>
          <p>HOBO Premium Edition</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-content">
          <div className="auth-header">
            <h2>Welcome Back.</h2>
            <p>Access your exclusive portfolio and upcoming stays.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FiMail className="input-icon" />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FiLock className="input-icon" />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" className="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-pwd" onClick={(e) => { e.preventDefault(); toast.success("Reset link sent!"); }}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            New to HOBO? 
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;