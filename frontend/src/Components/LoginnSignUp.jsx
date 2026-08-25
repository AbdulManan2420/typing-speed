import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginnSignUp.css";

const LoginnSignUp = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Frontend validation
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (registerData.email !== registerData.verifyEmail) {
      setError("Emails don't match");
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.verifyPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5173/api/auth/register",
        {
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Registration successful! Please login.");
        setRegisterData({
          username: "",
          email: "",
          verifyEmail: "",
          password: "",
          verifyPassword: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5173/api/auth/login",
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        {/* Registration Form */}
        <div className="formSection">
          <h3>Register</h3>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input"
            value={registerData.username}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="verifyEmail"
            placeholder="Verify Email"
            className="input"
            value={registerData.verifyEmail}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            className="input"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
            minLength="6"
          />
          <input
            type="password"
            name="verifyPassword"
            placeholder="Verify Password"
            className="input"
            value={registerData.verifyPassword}
            onChange={handleRegisterChange}
            required
          />
          <button 
            className="button" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        {/* Login Form */}
        <div className="formSection">
          <h3>Login</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button 
            className="button" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginnSignUp;