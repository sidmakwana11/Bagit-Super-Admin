import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async(e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Welcome to the Admin Panel!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/Admin");
      }
      } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };
  

  const handleNavigate = () => {
    window.location.href = 'http://localhost:3001/';
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
        <p>Don't have an account? <a href="/">Register</a></p>
        <button className='User-tab' onClick={handleNavigate}>Back to Shopping</button>
      </form>
    </div>
  );
};

export default LoginForm;
