import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful ✅");

      // ✅ Redirect based on role
      if (res.data.user.role === "student") navigate("/student");
      else if (res.data.user.role === "staff") navigate("/staff");
      else if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    
   
      
    <div className="login-container"style={{ padding: 20 }}>
       <div className="bordered-box2">
        <div className="login-form">
      <h2 className="login-text">Login</h2>

      <form onSubmit={handleLogin}>
        <input className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input className="input-field"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button  className="toggle-password-button2"type="button" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? "🔓" : "🔒"}
  </button>
        <br /><br />

        <button className="login-button"type="submit">Login</button>
        
      </form>


      <p className="donthave" >
        Don't have an account? <a className="link" href="/register">Register</a>
      </p>
    </div>
    </div>
    </div>
  );
}
