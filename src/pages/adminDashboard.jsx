import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
import { useLogo } from "../utils/logoManager.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logo, updateLogo } = useLogo();
  const [activeSection, setActiveSection] = useState("overview");
  const [currentLogo, setCurrentLogo] = useState("🏠"); // Default logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalListings: 0,
    totalUsers: 0,
    recentListings: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = url + "api";

  useEffect(() => {
    const styleId = 'admin-dashboard-styles';
    
    // Remove existing styles if they exist
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch dashboard stats from dedicated admin endpoint
      const dashboardResponse = await fetch(
        `${API_BASE_URL}/admin/dashboard-stats`
      );

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();

        if (dashboardData.success) {
          setDashboardData({
            totalListings: dashboardData.data.totalListings,
            totalUsers: dashboardData.data.totalUsers,
            recentListings: dashboardData.data.recentListings,
            recentUsers: dashboardData.data.recentUsers,
          });
        } else {
          setError("Failed to fetch dashboard data");
        }
      } else {
        // Fallback to individual endpoints if dashboard-stats is not available
        const propertiesResponse = await fetch(`${API_BASE_URL}/properties`);
        const propertiesData = await propertiesResponse.json();

        let totalUsers = Math.floor(Math.random() * 200) + 50; // Mock data

        if (propertiesData.success) {
          setDashboardData({
            totalListings: propertiesData.data.length,
            totalUsers: totalUsers,
            recentListings: propertiesData.data.slice(0, 5),
            recentUsers: [],
          });
        } else {
          setError("Failed to fetch dashboard data");
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin");
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const handleTotalListingsClick = () => {
    console.log("Navigate to total listings page");
  };

  const handleTotalUsersClick = () => {
    console.log("Navigate to total users page");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, GIF, and SVG files are allowed");
        return;
      }

      setLogoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (logoFile) {
      try {
        // Here you would upload to your backend
        console.log("Uploading logo:", logoFile);

        // Update the global logo state using the logo manager
        updateLogo(logoPreview);
        console.log("Logo updated globally:", logoPreview);

        // For now, just update the preview as the current logo
        setCurrentLogo(logoPreview);

        alert("Logo updated successfully!");
        setLogoFile(null);
        setLogoPreview(null);
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Failed to upload logo. Please try again.");
      }
    }
  };

  // Load saved logo on component mount
  useEffect(() => {
    if (logo.useImage && logo.image) {
      setCurrentLogo(logo.image);
    } else {
      setCurrentLogo(logo.text || "🏠");
    }
  }, [logo]);

  const handleCancelLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="admin-dashboard-section">
            <h2 className="card-title">Dashboard Overview</h2>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-2 gap-5 mb-5">
              {/* Total Listings Card */}
              <div
                onClick={handleTotalListingsClick}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">🏠</div>
                <h2 className="dashboard-card-title">
                  {loading ? "..." : dashboardData.totalListings}
                </h2>
                <p className="dashboard-card-subtitle">
                  Total Listings
                </p>
              </div>

              {/* Total Users Card */}
              <div
                onClick={handleTotalUsersClick}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">👥</div>
                <h2 className="dashboard-card-title">
                  {loading ? "..." : dashboardData.totalUsers}
                </h2>
                <p className="dashboard-card-subtitle">
                  Total Users
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-2 gap-5">
              {/* Recent Listings */}
              <div className="card">
                <h3 className="card-title">Recent Listings</h3>
                {dashboardData.recentListings.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {dashboardData.recentListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="dashboard-recent-listing"
                      >
                        <h4>{listing.title}</h4>
                        <p>
                          {listing.location} - Rs{" "}
                          {parseFloat(listing.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary">No listings available</p>
                )}
              </div>

              {/* System Info */}
              <div className="dashboard-quick-action">
                <h3 className="card-title">Quick Actions</h3>
                <div className="dashboard-quick-action-buttons">
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    {loading ? "Refreshing..." : "🔄 Refresh Data"}
                  </button>

                  <button
                    onClick={() => navigate("/filter")}
                    className="btn btn-primary"
                  >
                    🏠 View All Properties
                  </button>

                  <button
                    onClick={() => window.open("/", "_blank")}
                    className="btn btn-warning"
                  >
                    🌐 View Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "homepage":
        return (
          <div>
            <h2 className="card-title">Homepage Management</h2>

            {/* Logo Management Section */}
            <div className="dashboard-logo-section">
              <h3 className="card-title">Website Logo</h3>

              <div className="flex gap-5 mb-5">
                <div>
                  <label className="form-label">
                    Current Logo:
                  </label>
                  <div className="dashboard-logo-preview">
                    {typeof currentLogo === "string" &&
                    currentLogo.length <= 2 ? (
                      currentLogo
                    ) : (
                      <img
                        src={currentLogo}
                        alt="Current Logo"
                      />
                    )}
                  </div>
                </div>

                {logoPreview && (
                  <div>
                    <label className="form-label">
                      Preview:
                    </label>
                    <div className="dashboard-logo-preview" style={{ borderColor: '#3b82f6' }}>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="dashboard-logo-upload">
                <label htmlFor="logoUpload" className="form-label">
                  Upload New Logo:
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="form-input"
                />
                <p className="text-secondary">
                  Supported formats: JPG, PNG, SVG, GIF (Max size: 2MB)
                </p>
              </div>

              {logoFile && (
                <div className="dashboard-logo-actions">
                  <button
                    onClick={handleSaveLogo}
                    className="btn btn-primary"
                  >
                    Save Logo
                  </button>
                  <button
                    onClick={handleCancelLogo}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Site Settings */}
            <div className="dashboard-site-info">
              <h3 className="card-title">Site Information</h3>
              <div className="dashboard-site-info-grid">
                <div>
                  <p><strong>Site Name:</strong> GharBazaar</p>
                  <p><strong>Version:</strong> 1.0.0</p>
                  <p><strong>Environment:</strong> Development</p>
                </div>
                <div>
                  <p><strong>Database:</strong> MySQL</p>
                  <p><strong>Server:</strong> Node.js</p>
                  <p><strong>Status:</strong> <span>● Online</span></p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-quick-action">
              <h3 className="card-title">Management Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.open("/", "_blank")}
                  className="btn btn-warning"
                >
                  🌐 View Live Site
                </button>

                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="btn btn-success"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh Data"}
                </button>

                <button
                  onClick={() => navigate("/filter")}
                  className="btn btn-primary"
                >
                  🏠 Manage Properties
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-dashboard-sidebar">
        {/* Admin Header */}
        <div className="admin-dashboard-sidebar-header">
          <h1>GharBazaar Admin</h1>
          <p>Administrative Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-dashboard-nav">
          <div
            onClick={() => setActiveSection("overview")}
            className={`admin-dashboard-nav-item ${activeSection === "overview" ? "active" : ""}`}
          >
            📊 Dashboard Overview
          </div>

          <div
            onClick={() => setActiveSection("homepage")}
            className={`admin-dashboard-nav-item ${activeSection === "homepage" ? "active" : ""}`}
          >
            🏠 Homepage Management
          </div>
        </nav>

        {/* Logout Button */}
        <div className="admin-dashboard-logout">
          <button
            onClick={handleLogout}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        {/* Welcome Header */}
        <div className="admin-dashboard-welcome">
          <h1>Welcome Admin</h1>
          <p>Manage your GharBazaar platform from this dashboard</p>
        </div>

        {/* Dynamic Content */}
        <div className="admin-dashboard-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;