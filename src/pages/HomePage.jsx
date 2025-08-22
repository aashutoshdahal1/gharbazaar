import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
import Navbar from "../components/Navbar";
import { LogoDisplay } from "../utils/logoManager.jsx";

export default function GharBazaarHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= 992 && window.innerWidth > 768
      : false
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentListings, setRecentListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = url + "api";

  const fetchRecentListings = useCallback(async () => {
    try {
      setLoadingListings(true);
      const response = await fetch(`${API_BASE_URL}/properties?limit=4`);
      const data = await response.json();

      if (data.success) {
        setRecentListings(data.data || []);
      } else {
        console.error("Failed to fetch recent listings:", data.message);
        setRecentListings([]);
      }
    } catch (error) {
      console.error("Error fetching recent listings:", error);
      setRecentListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, [API_BASE_URL]);

  // Check for user authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    // Fetch recent listings
    fetchRecentListings();
  }, [fetchRecentListings]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 992 && window.innerWidth > 768);
      // Close mobile menu when screen gets larger
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 992 && window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAuthClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/filter?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/filter");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      backgroundColor: "white",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile ? "0 0.75rem" : "0 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: isMobile ? "3.5rem" : "4.5rem",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.5rem" : "0.75rem",
      fontSize: isMobile ? "1.25rem" : "1.75rem",
      fontWeight: "700",
      color: "#1e40af",
      cursor: "pointer",
      textDecoration: "none",
      transition: "transform 0.2s ease",
    },
    logoIcon: {
      fontSize: isMobile ? "1.25rem" : "1.75rem",
    },
    navSection: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: "2rem",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: isTablet ? "1.5rem" : "2rem",
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    navLink: {
      color: "#4b5563",
      fontSize: "0.95rem",
      fontWeight: "500",
      textDecoration: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      transition: "all 0.2s ease",
      cursor: "pointer",
    },

    authButtons: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: isMobile ? "0.5rem" : "1rem",
    },
    authBtn: {
      backgroundColor: "#1e40af",
      color: "white",
      padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: isMobile ? "0.8rem" : "0.9rem",
      fontWeight: "600",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(30, 64, 175, 0.2)",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.5rem" : "0.75rem",
      cursor: "pointer",
      padding: isMobile ? "0.5rem" : "0.5rem 1rem",
      borderRadius: "0.5rem",
      transition: "background-color 0.2s ease",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
    },
    profileName: {
      color: "#1f2937",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      fontWeight: "600",
    },
    profileAvatar: {
      width: isMobile ? "1.75rem" : "2rem",
      height: isMobile ? "1.75rem" : "2rem",
      borderRadius: "50%",
      backgroundColor: "#1e40af",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "0.8rem" : "0.9rem",
      fontWeight: "600",
    },
    profileDropdownIcon: {
      fontSize: "0.8rem",
      color: "#6b7280",
      marginLeft: "0.25rem",
    },
    logoutBtn: {
      backgroundColor: "transparent",
      color: "#ef4444",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #ef4444",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    mobileMenuBtn: {
      display: isMobile ? "block" : "none",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      color: "#6b7280",
    },
    mobileMenu: {
      display: isMobile && isMobileMenuOpen ? "block" : "none",
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "white",
      borderBottom: "1px solid #e5e7eb",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 999,
    },
    mobileMenuContent: {
      padding: "1rem",
      maxWidth: "1280px",
      margin: "0 auto",
    },
    mobileNavLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginBottom: "1rem",
    },
    mobileNavLink: {
      color: "#4b5563",
      fontSize: "1rem",
      fontWeight: "500",
      textDecoration: "none",
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      transition: "all 0.2s ease",
      cursor: "pointer",
      backgroundColor: "#f9fafb",
      textAlign: "center",
    },
    mobileAuthSection: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "1rem",
    },
    hero: {
      background: "linear-gradient(to right, #10b981, #1e40af)",
      color: "white",
      padding: isMobile ? "2rem 0" : "5rem 0",
      textAlign: "center",
    },
    heroContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile ? "0 1rem" : "0 1rem",
    },
    heroTitle: {
      fontSize: isMobile ? "1.875rem" : "3rem",
      fontWeight: "bold",
      marginBottom: isMobile ? "0.75rem" : "1.5rem",
    },
    heroSubtitle: {
      fontSize: isMobile ? "1rem" : "1.25rem",
      marginBottom: isMobile ? "1rem" : "2rem",
      color: "#dbeafe",
    },
    searchContainer: {
      maxWidth: isMobile ? "100%" : "28rem",
      margin: "0 auto",
      padding: isMobile ? "0 1rem" : "0",
    },
    searchBox: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: "white",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    searchInput: {
      flex: 1,
      padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
      border: "none",
      outline: "none",
      fontSize: isMobile ? "0.875rem" : "1rem",
    },
    searchBtn: {
      backgroundColor: "#10b981",
      color: "white",
      padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      ...(isMobile && {
        marginTop: "0.5rem",
        borderRadius: "0.25rem",
        margin: "0.5rem",
      }),
    },
    filterTabs: {
      backgroundColor: "white",
      borderBottom: "1px solid #e5e7eb",
    },
    filterTabsContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      paddingLeft: isMobile ? "1rem" : "1rem",
      paddingRight: isMobile ? "1rem" : "1rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      display: "flex",
      gap: isMobile ? "0.75rem" : "2rem",
      overflowX: isMobile ? "auto" : "visible",
      scrollbarWidth: isMobile ? "none" : "auto",
      msOverflowStyle: isMobile ? "none" : "auto",
    },
    filterTab: {
      padding: isMobile ? "0.5rem" : "0.5rem 1rem",
      color: "#6b7280",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      borderBottom: "2px solid transparent",
      whiteSpace: "nowrap",
      fontSize: isMobile ? "0.85rem" : "1rem",
    },
    featuredSection: {
      padding: isMobile ? "1.5rem 0" : "3rem 0",
    },
    featuredContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile ? "0 1rem" : "0 1rem",
    },
    featuredTitle: {
      fontSize: isMobile ? "1.25rem" : "1.875rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: isMobile ? "1rem" : "2rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fill, minmax(280px, 1fr))",
      gap: isMobile ? "1rem" : "1.5rem",
      marginBottom: isMobile ? "1rem" : "2rem",
      maxWidth: "100%",
    },
    card: {
      backgroundColor: "white",
      borderRadius: isMobile ? "0.375rem" : "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "1px solid #e5e7eb",
      width: "100%",
      minWidth: isMobile ? "0" : "280px",
    },
    cardImage: {
      height: isMobile ? "8rem" : "12rem",
      backgroundColor: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
    },
    cardContent: {
      padding: isMobile ? "0.75rem" : "1rem",
    },
    cardType: {
      backgroundColor: "#10b981",
      color: "white",
      fontSize: "0.75rem",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      display: "inline-block",
      marginBottom: "0.5rem",
    },
    cardTitle: {
      fontWeight: "600",
      color: "#111827",
      marginBottom: "0.25rem",
    },
    cardLocation: {
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    viewAllBtn: {
      textAlign: "center",
    },
    viewAllLink: {
      color: "#10b981",
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
    },
    footer: {
      background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
      color: "white",
      padding: isMobile ? "2rem 0" : "3rem 0 2rem 0",
      position: "relative",
      overflow: "hidden",
    },
    footerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile ? "0 1rem" : "0 2rem",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(250px, 1fr))",
      gap: isMobile ? "2rem" : "3rem",
      position: "relative",
      zIndex: 2,
    },
    footerSection: {
      marginBottom: isMobile ? "1rem" : "0",
    },
    footerTitle: {
      fontSize: isMobile ? "1.5rem" : "1.75rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      background: "linear-gradient(45deg, #3b82f6, #1e40af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    footerSubtitle: {
      fontWeight: "600",
      marginBottom: "1rem",
      fontSize: "1.1rem",
      color: "#e5e7eb",
    },
    footerText: {
      color: "#9ca3af",
      lineHeight: "1.6",
      fontSize: "0.95rem",
    },
    footerList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    footerListItem: {
      marginBottom: "0.75rem",
    },
    footerLink: {
      color: "#9ca3af",
      textDecoration: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.95rem",
      position: "relative",
      display: "inline-block",
    },
    footerSocialSection: {
      textAlign: isMobile ? "center" : "left",
    },
    socialLinks: {
      display: "flex",
      gap: "1rem",
      justifyContent: isMobile ? "center" : "flex-start",
      marginTop: "1rem",
    },
    socialLink: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3b82f6",
      textDecoration: "none",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    footerBottom: {
      borderTop: "1px solid rgba(75, 85, 99, 0.3)",
      marginTop: "2rem",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      textAlign: "center",
      color: "#9ca3af",
      background: "rgba(0, 0, 0, 0.2)",
      margin: "2rem -2rem -2rem -2rem",
    },
    footerPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      zIndex: 1,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <LogoDisplay
            style={styles.logo}
            size="medium"
            onClick={handleLogoClick}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          {/* Navigation Links */}
          <nav style={styles.navSection}>
            <ul style={styles.navLinks}>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                >
                  Home
                </span>
              </li>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                  onClick={() => navigate("/filter")}
                >
                  Properties
                </span>
              </li>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                  onClick={() => window.location.href = "/about"}
                >
                  About
                </span>
              </li>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                  onClick={() => window.location.href = "/contact"}
                >
                  Contact
                </span>
              </li>

            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button style={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Auth Section */}
          <div style={styles.authButtons}>
            {isLoggedIn ? (
              <>
                <div
                  style={styles.profileContainer}
                  onClick={handleProfileClick}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#e5e7eb";
                    e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f9fafb";
                    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                  title="Go to Dashboard"
                >
                  <div style={styles.profileAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div
                    style={{
                      display: isMobile ? "none" : "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={styles.profileName}>Hi, {user?.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      View Dashboard
                    </span>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#6b7280"
                    viewBox="0 0 24 24"
                    style={styles.profileDropdownIcon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <button
                  style={styles.logoutBtn}
                  onClick={handleLogout}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#ef4444";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                style={styles.authBtn}
                onClick={handleAuthClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1d4ed8";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#1e40af";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuContent}>
            {/* Mobile Navigation Links */}
            <div style={styles.mobileNavLinks}>
              <span
                style={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </span>
              <span
                style={styles.mobileNavLink}
                onClick={() => {
                  navigate("/filter");
                  setIsMobileMenuOpen(false);
                }}
              >
                Properties
              </span>
              <span
                style={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </span>
              <span
                style={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </span>
            </div>

            {/* Mobile Auth Section */}
            <div style={styles.mobileAuthSection}>
              {isLoggedIn ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      ...styles.profileContainer,
                      justifyContent: "center",
                      paddingTop: "1rem",
                      paddingBottom: "1rem",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                    }}
                    onClick={() => {
                      handleProfileClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div style={styles.profileAvatar}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span style={styles.profileName}>Hi, {user?.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        View Dashboard
                      </span>
                    </div>
                  </div>
                  <button
                    style={{
                      ...styles.logoutBtn,
                      width: "100%",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                      paddingLeft: "0.75rem",
                      paddingRight: "0.75rem",
                      textAlign: "center",
                    }}
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  style={{
                    ...styles.authBtn,
                    width: "100%",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    handleAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find your perfect home in Nepal</h1>
          <p style={styles.heroSubtitle}>
            Explore a wide range of rental properties across Nepal, from cozy
            rooms to spacious houses
          </p>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button onClick={handleSearch} style={styles.searchBtn}>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredContent}>
          <h2 style={styles.featuredTitle}>Recent Listings</h2>

          {loadingListings ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              Loading recent listings...
            </div>
          ) : recentListings.length > 0 ? (
            <div style={styles.grid}>
              {recentListings.map((listing) => {
                let images = [];
                let coverImage = null;
                try {
                  images = listing.images ? JSON.parse(listing.images) : [];
                  // Handle new format with cover image info
                  if (images.length > 0 && typeof images[0] === "object") {
                    coverImage = images.find((img) => img.isCover) || images[0];
                  } else if (images.length > 0) {
                    // Fallback for old format
                    coverImage = { url: images[0] };
                  }
                } catch (error) {
                  console.error("Error parsing images JSON:", error);
                  images = [];
                }

                return (
                  <div
                    key={listing.id}
                    style={styles.card}
                    onClick={() => navigate(`/property/${listing.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div style={styles.cardImage}>
                      {coverImage ? (
                        <img
                          src={`${url.replace(/\/$/, "")}${coverImage.url}`}
                          alt={listing.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          ...styles.cardImage,
                          display: coverImage ? "none" : "flex",
                        }}
                      >
                        📷 No Image Available
                      </div>
                    </div>
                    <div style={styles.cardContent}>
                      <span style={styles.cardType}>
                        {listing.property_type}
                      </span>
                      <h3 style={styles.cardTitle}>{listing.title}</h3>
                      <p style={styles.cardLocation}>
                        Rs. {parseInt(listing.price).toLocaleString()}
                        {listing.purpose === "rent" ? "/month" : ""}
                      </p>
                      <p
                        style={{
                          ...styles.cardLocation,
                          fontSize: "0.8rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        📍 {listing.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              No recent listings available.
            </div>
          )}

          <div style={styles.viewAllBtn}>
            <span
              style={styles.viewAllLink}
              onClick={() => navigate("/filter")}
            >
              View all listings →
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerPattern}></div>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <LogoDisplay
              style={styles.footerTitle}
              size="large"
              showText={true}
            />
            <p style={styles.footerText}>
              Your trusted platform for finding the perfect home in Nepal. We
              connect property seekers with their dream properties across the
              beautiful landscapes of Nepal.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <a
                  href="/about"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  → About Us
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a
                  href="contact"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  → Contact Us
                </a>
              </li>
              <li style={styles.footerListItem}>
              </li>
              <li style={styles.footerListItem}>
              </li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Property Types</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <a
                  href="#"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  🏠 Rooms for Rent
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a
                  href="#"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  🏢 Apartments & Flats
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a
                  href="#"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  🏘️ Houses & Villas
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a
                  href="#"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#3b82f6";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9ca3af";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  🌍 Land & Plots
                </a>
              </li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Contact Info</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <span style={styles.footerText}>📧 info@gharbazaar.com</span>
              </li>
              <li style={styles.footerListItem}>
                <span style={styles.footerText}>📞 +977-1-4444444</span>
              </li>
              <li style={styles.footerListItem}>
                <span style={styles.footerText}>📍 Kathmandu, Nepal</span>
              </li>
              <li style={styles.footerListItem}>
                <span style={styles.footerText}>🕒 24/7 Customer Support</span>
              </li>
            </ul>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 GharBazaar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
