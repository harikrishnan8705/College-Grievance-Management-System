import { toast } from "react-toastify";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import '../login.css'

export default function StaffLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", { username, password });

      if (res.data.user.role !== "staff") {
        toast.error("This login is only for staff ");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    toast.success("Login Successfully");
      navigate("/staff");
    } catch (err) {
       toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="bordered-box2">
     <div  className="login-form"> 
      <h2 className="staff-login-text">Staff Login</h2>

      <form onSubmit={handleLogin}>
        <input className="input-field"
          placeholder="Staff Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

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

        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
    </div>
    </div>
  );
}