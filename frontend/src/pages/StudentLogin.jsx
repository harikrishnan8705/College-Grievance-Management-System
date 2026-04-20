import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../login.css"

export default function StudentLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  

  
  const handleLogin = async (e) => {
  e.preventDefault();

  //  Validate BEFORE API call
  if (!username || !dob) {
    alert("Please enter username and date of birth");
    return;
  }

  try {
    const res = await API.post("/api/auth/login", { username, dob });

    if (res.data.user.role !== "student") {
      alert("This login is only for students");
      return;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/student");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <>
    <div className="login-container">
      
     <div className="bordered-box2">
     <div  className="login-form"> 
      
      <h2 className="login-text">Student Login</h2>
      <form onSubmit={handleLogin}>
        <input
        className="input-field"
          placeholder=" Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />

        <br />

        <input type="date" 
          className="input-field"
          placeholder="password"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          />
          

         <br />

        <button  className="login-button"type="submit">Login</button>
      </form>
      </div>
      </div>
    </div>
    </>
  );
}