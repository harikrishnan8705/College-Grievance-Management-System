import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import LoginSelect from "./pages/LoginSelect";
import AdminLogin from "./pages/AdminLogin";





export default function App() {
  return (
    <>
    <BrowserRouter>
     <ToastContainer position="top-right" autoClose={3000} style={{ marginTop: "70px" }} /> 
      <Routes>
      
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/" element={<LoginSelect />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

      </Routes>
    </BrowserRouter>
    </>
  );
}
