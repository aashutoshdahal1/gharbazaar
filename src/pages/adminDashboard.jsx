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
          <div>
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "30px",
                color: "#1f2937",
              }}
            >
              Dashboard Overview
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
                marginBottom: "40px",
              }}
            >
              {/* Total Listings Card */}
              <div
                onClick={handleTotalListingsClick}
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid #e5e7eb",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow =
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    fontSize: "60px",
                    marginBottom: "20px",
                    color: "#3b82f6",
                  }}
                >
                  🏠
                </div>
                <h2
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0 0 10px 0",
                  }}
                >
                  {loading ? "..." : dashboardData.totalListings}
                </h2>
                <p
                  style={{
                    fontSize: "1.25rem",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  Total Listings
                </p>
              </div>

              {/* Total Users Card */}
              <div
                onClick={handleTotalUsersClick}
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid #e5e7eb",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow =
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    fontSize: "60px",
                    marginBottom: "20px",
                    color: "#10b981",
                  }}
                >
                  👥
                </div>
                <h2
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0 0 10px 0",
                  }}
                >
                  {loading ? "..." : dashboardData.totalUsers}
                </h2>
                <p
                  style={{
                    fontSize: "1.25rem",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  Total Users
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
              }}
            >
              {/* Recent Listings */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "20px",
                    color: "#1f2937",
                  }}
                >
                  Recent Listings
                </h3>
                {dashboardData.recentListings.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {dashboardData.recentListings.map((listing) => (
                      <div
                        key={listing.id}
                        style={{
                          padding: "15px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <h4 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>
                          {listing.title}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "0.875rem",
                            color: "#6b7280",
                          }}
                        >
                          {listing.location} - Rs{" "}
                          {parseFloat(listing.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#6b7280" }}>No listings available</p>
                )}
              </div>

              {/* System Info */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "20px",
                    color: "#1f2937",
                  }}
                >
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Refreshing..." : "🔄 Refresh Data"}
                  </button>

                  <button
                    onClick={() => navigate("/filter")}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🏠 View All Properties
                  </button>

                  <button
                    onClick={() => window.open("/", "_blank")}
                    style={{
                      backgroundColor: "#f59e0b",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
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
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "30px",
                color: "#1f2937",
              }}
            >
              Homepage Management
            </h2>

            {/* Logo Management Section */}
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "#1f2937",
                }}
              >
                Website Logo
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Current Logo:
                  </label>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      backgroundColor: "#f9fafb",
                      overflow: "hidden",
                    }}
                  >
                    {typeof currentLogo === "string" &&
                    currentLogo.length <= 2 ? (
                      currentLogo
                    ) : (
                      <img
                        src={currentLogo}
                        alt="Current Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                </div>

                {logoPreview && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Preview:
                    </label>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        border: "2px solid #3b82f6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="logoUpload"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Upload New Logo:
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  Supported formats: JPG, PNG, SVG, GIF (Max size: 2MB)
                </p>
              </div>

              {logoFile && (
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={handleSaveLogo}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Save Logo
                  </button>
                  <button
                    onClick={handleCancelLogo}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Site Settings */}
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "#1f2937",
                }}
              >
                Site Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <p>
                    <strong>Site Name:</strong> GharBazaar
                  </p>
                  <p>
                    <strong>Version:</strong> 1.0.0
                  </p>
                  <p>
                    <strong>Environment:</strong> Development
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Database:</strong> MySQL
                  </p>
                  <p>
                    <strong>Server:</strong> Node.js
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: "#10b981" }}>● Online</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "#1f2937",
                }}
              >
                Management Actions
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                <button
                  onClick={() => window.open("/", "_blank")}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  🌐 View Live Site
                </button>

                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Refreshing..." : "🔄 Refresh Data"}
                </button>

                <button
                  onClick={() => navigate("/filter")}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          backgroundColor: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        {/* Admin Header */}
        <div
          style={{
            padding: "30px 20px",
            borderBottom: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              color: "#3b82f6",
              margin: "0 0 10px 0",
              fontWeight: "bold",
            }}
          >
            GharBazaar Admin
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Administrative Panel
          </p>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: "20px 0" }}>
          <div
            onClick={() => setActiveSection("overview")}
            style={{
              padding: "15px 20px",
              cursor: "pointer",
              backgroundColor:
                activeSection === "overview" ? "#f3f4f6" : "transparent",
              borderLeft:
                activeSection === "overview"
                  ? "4px solid #3b82f6"
                  : "4px solid transparent",
              color: activeSection === "overview" ? "#3b82f6" : "#1f2937",
              fontWeight: activeSection === "overview" ? "600" : "normal",
              transition: "all 0.3s ease",
            }}
          >
            📊 Dashboard Overview
          </div>

          <div
            onClick={() => setActiveSection("homepage")}
            style={{
              padding: "15px 20px",
              cursor: "pointer",
              backgroundColor:
                activeSection === "homepage" ? "#f3f4f6" : "transparent",
              borderLeft:
                activeSection === "homepage"
                  ? "4px solid #3b82f6"
                  : "4px solid transparent",
              color: activeSection === "homepage" ? "#3b82f6" : "#1f2937",
              fontWeight: activeSection === "homepage" ? "600" : "normal",
              transition: "all 0.3s ease",
            }}
          >
            🏠 Homepage Management
          </div>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "12px 0",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          backgroundColor: "#f3f4f6",
          overflowY: "auto",
        }}
      >
        {/* Welcome Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              color: "#1f2937",
              margin: "0 0 10px 0",
              fontWeight: "bold",
            }}
          >
            Welcome Admin
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.125rem",
              margin: 0,
            }}
          >
            Manage your GharBazaar platform from this dashboard
          </p>
        </div>

        {/* Dynamic Content */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
