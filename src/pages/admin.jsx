import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";

const Admin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = url + "api";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin token and user data
        localStorage.setItem("adminToken", data.data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.data.user));

        // Navigate to admin dashboard
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form">
        <div className="card-header">
          <h1 className="card-title">Admin Login</h1>
          <p className="card-subtitle">Access the administrative dashboard</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%", marginTop: "20px" }}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Signing In...
                </>
              ) : (
                "Login to Admin Dashboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
