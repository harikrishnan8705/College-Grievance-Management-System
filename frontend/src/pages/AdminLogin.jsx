import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../login.css"

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", { email, password });

      if (res.data.user.role !== "admin") {
        alert("Not an admin account ");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate("/admin");
    } catch (err) {
       console.log("FULL ERROR:", err);
  console.log("DATA:", err.response?.data);

  alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
    <div className="login-container">
      <div className="bordered-box2">
     <div  className="login-form"> 

      <h2 className="login-text">Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input className="input-field"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input className="input-field"
           type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button  className="toggle-password-button2"type="button" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? "🔓" : "🔒"}
  </button>
      <br />
        <button  className="login-button" type="submit">Login</button>
      </form>
    </div>
    </div>
    </div>
    </>
  );
}