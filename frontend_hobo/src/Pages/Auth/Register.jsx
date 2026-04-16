import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiBriefcase } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { registerUser } from "../../Services/api";
import { AuthContext } from "../../Context/AuthContext";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const res = await registerUser(formData);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to the club, ${res.data.user.name}`);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
            <h2>Join the Club.</h2>
            <p>Become a member to explore exclusive stays.</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister} noValidate>
            
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <FiUser className="input-icon" />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <FiLock className="input-icon" />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>Select Role</label>
              <div className="input-wrapper">
                <select 
                  className="auth-input" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ appearance: "none", cursor: "pointer", paddingLeft: "32px" }}
                >
                  <option value="user" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Traveler / User</option>
                  <option value="owner" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Hostel Owner</option>
                </select>
                <FiBriefcase className="input-icon" />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '15px' }}>
              {loading ? <div className="spinner"></div> : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? 
            <Link to="/login">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;