import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl"; // Import the API base URL
import Navbar from "../components/Navbar";
import { LogoDisplay } from "../utils/logoManager.jsx";
const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 0,
    savedProperties: 0,
    messages: 0,
  });

  const API_BASE_URL = url + "api";

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

  const fetchUserStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch user's listings count
      const listingsResponse = await fetch(
        `${API_BASE_URL}/properties/my-listings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const listingsData = await listingsResponse.json();

      if (listingsData.success) {
        setStats((prevStats) => ({
          ...prevStats,
          activeListings: listingsData.data.length,
        }));
      }

      // Fetch user's favorites count
      const favoritesResponse = await fetch(`${API_BASE_URL}/favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const favoritesData = await favoritesResponse.json();

      if (favoritesData.success) {
        setStats((prevStats) => ({
          ...prevStats,
          savedProperties: favoritesData.data.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [API_BASE_URL]);

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
          // Fetch stats after user verification
          await fetchUserStats();
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setError("Session verification failed");
      } finally {
        setLoading(false);
      }
    },
    [handleLogout, API_BASE_URL, fetchUserStats]
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

  // Refresh stats when component mounts or when user navigates back
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchUserStats();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, fetchUserStats]);

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
      gap: "0.75rem",
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#1e40af",
      cursor: "pointer",
      textDecoration: "none",
      transition: "transform 0.2s ease",
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
      cursor: "pointer",
      transition: "all 0.2s ease",
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
          <LogoDisplay
            style={styles.logoContainer}
            size="large"
            imageSize="56px"
            textSize="14px"
            onClick={handleHomeClick}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
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
                onClick={handleBrowsePropertiesClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Properties
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
            <div
              style={styles.statCard}
              onClick={handleMyListingsClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={styles.statNumber}>{stats.activeListings}</div>
              <div style={styles.statLabel}>Active Listings</div>
            </div>

            <div
              style={styles.statCard}
              onClick={handleFavoritesClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={styles.statNumber}>{stats.savedProperties}</div>
              <div style={styles.statLabel}>Saved Properties</div>
            </div>

            <div
              style={styles.statCard}
              onClick={handleViewMessagesClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={styles.statNumber}>{stats.messages}</div>
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
