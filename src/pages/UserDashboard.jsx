import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5001/api";

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleMyListingsClick = () => {
    // Navigate to user's listings page
    navigate("/my-listings");
  };

  const handleFavoritesClick = () => {
    // Navigate to user's favorites page
    navigate("/favorites");
  };

  const handleProfileClick = () => {
    // Navigate to user's profile page
    navigate("/profile");
  };

  const handleAddPropertyClick = () => {
    // Navigate to add property page
    navigate("/add-listing");
  };

  const handleBrowsePropertiesClick = () => {
    // Navigate to browse properties page
    navigate("/filter");
  };

  const handleViewMessagesClick = () => {
    // Navigate to messages page
    navigate("/messages");
  };

  const handleEditProfileClick = () => {
    // Navigate to edit profile page
    navigate("/edit-profile");
  };

  const verifyToken = useCallback(
    async (token) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!data.success) {
          handleLogout();
        } else {
          setUser(data.data.user);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setError("Session verification failed");
      } finally {
        setLoading(false);
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
      verifyToken(token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      handleLogout();
    }
  }, [navigate, verifyToken, handleLogout]);

  const styles = {
    designRoot: {
      position: "relative",
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      flexDirection: "column",
      backgroundColor: "#f8fafc",
      overflowX: "hidden",
    },
    layoutContainer: {
      display: "flex",
      height: "100%",
      flexGrow: 1,
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      whiteSpace: "nowrap",
      borderBottom: "1px solid #f1f3f4",
      padding: "12px 40px",
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      color: "#121516",
    },
    logo: {
      width: "16px",
      height: "16px",
    },
    title: {
      color: "#121516",
      fontSize: "18px",
      fontWeight: "bold",
      lineHeight: "1.25",
      letterSpacing: "-0.015em",
    },
    navLinks: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      gap: "32px",
    },
    navLinkContainer: {
      display: "flex",
      alignItems: "center",
      gap: "36px",
    },
    navLink: {
      color: "#121516",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "normal",
      textDecoration: "none",
      cursor: "pointer",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    logoutButton: {
      display: "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "40px",
      padding: "0 16px",
      backgroundColor: "#ef4444",
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
      lineHeight: "normal",
      letterSpacing: "0.015em",
      border: "none",
    },
    mainContent: {
      padding: "40px",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: "24px",
    },
    welcomeCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    welcomeTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#121516",
      marginBottom: "8px",
    },
    welcomeSubtitle: {
      fontSize: "16px",
      color: "#6b7280",
      marginBottom: "24px",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
    },
    statCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#121516",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "14px",
      color: "#6b7280",
      fontWeight: 500,
    },
    quickActions: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#121516",
      marginBottom: "20px",
    },
    actionButtons: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 24px",
      backgroundColor: "#10b981",
      color: "white",
      borderRadius: "12px",
      border: "none",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#6b7280",
    },
    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "12px 16px",
      borderRadius: "8px",
      margin: "16px 0",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading your dashboard...</div>;
  }

  return (
    <div style={styles.designRoot}>
      <div style={styles.layoutContainer}>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 style={styles.title}>GharBazaar</h2>
          </div>
          <div style={styles.navLinks}>
            <div style={styles.navLinkContainer}>
              <span
                style={styles.navLink}
                onClick={handleHomeClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Home
              </span>
              <span
                style={styles.navLink}
                onClick={handleMyListingsClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                My Listings
              </span>
              <span
                style={styles.navLink}
                onClick={handleFavoritesClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Favorites
              </span>
              <span
                style={styles.navLink}
                onClick={handleProfileClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Profile
              </span>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div style={styles.mainContent}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.welcomeCard}>
            <h1 style={styles.welcomeTitle}>Welcome back, {user?.name}!</h1>
            <p style={styles.welcomeSubtitle}>
              Manage your properties and explore new opportunities in the real
              estate market.
            </p>
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Active Listings</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Total Views</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Saved Properties</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Messages</div>
            </div>
          </div>

          <div style={styles.quickActions}>
            <h3 style={styles.sectionTitle}>Quick Actions</h3>
            <div style={styles.actionButtons}>
              <button
                style={styles.actionButton}
                onClick={handleAddPropertyClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                + Add New Property
              </button>
              <button
                style={styles.actionButton}
                onClick={handleBrowsePropertiesClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Browse Properties
              </button>
              <button
                style={styles.actionButton}
                onClick={handleViewMessagesClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                View Messages
              </button>
              <button
                style={styles.actionButton}
                onClick={handleEditProfileClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
