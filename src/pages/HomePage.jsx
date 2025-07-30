import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GharBazaarHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const featuredListings = [
    {
      id: 1,
      title: "Cozy Room in Kathmandu",
      location: "Rs. 15,000/month",
      type: "Room",
    },
    {
      id: 2,
      title: "Modern Flat in Pokhara",
      location: "Rs. 25,000/month",
      type: "Flat",
    },
    {
      id: 3,
      title: "Spacious Land in Chitwan",
      location: "Rs. 50,00,000",
      type: "Land",
    },
    {
      id: 4,
      title: "Beautiful House in Lalitpur",
      location: "Rs. 1,20,00,000",
      type: "House",
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
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
      padding: "0 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "4.5rem",
    },
    logo: {
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
    logoIcon: {
      fontSize: "1.75rem",
    },
    navSection: {
      display: "flex",
      alignItems: "center",
      gap: "2rem",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "2rem",
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
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    authBtn: {
      backgroundColor: "#1e40af",
      color: "white",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(30, 64, 175, 0.2)",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      cursor: "pointer",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      transition: "background-color 0.2s ease",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
    },
    profileName: {
      color: "#1f2937",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    profileAvatar: {
      width: "2rem",
      height: "2rem",
      borderRadius: "50%",
      backgroundColor: "#1e40af",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.9rem",
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
      display: "none",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      color: "#6b7280",
    },
    // Responsive styles for mobile
    "@media (max-width: 768px)": {
      navSection: {
        display: "none",
      },
      mobileMenuBtn: {
        display: "block",
      },
      headerContent: {
        padding: "0 1rem",
      },
      authButtons: {
        gap: "0.5rem",
      },
      profileName: {
        display: "none",
      },
    },
    hero: {
      background: "linear-gradient(to right, #2563eb, #1e40af)",
      color: "white",
      padding: "5rem 0",
      textAlign: "center",
    },
    heroContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    heroTitle: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
    },
    heroSubtitle: {
      fontSize: "1.25rem",
      marginBottom: "2rem",
      color: "#dbeafe",
    },
    searchContainer: {
      maxWidth: "28rem",
      margin: "0 auto",
    },
    searchBox: {
      display: "flex",
      backgroundColor: "white",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    searchInput: {
      flex: 1,
      padding: "1rem 1.5rem",
      border: "none",
      outline: "none",
      fontSize: "1rem",
    },
    searchBtn: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "1rem 1.5rem",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
    },
    filterTabs: {
      backgroundColor: "white",
      borderBottom: "1px solid #e5e7eb",
    },
    filterTabsContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 1rem",
      display: "flex",
      gap: "2rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
    },
    filterTab: {
      padding: "0.5rem 1rem",
      color: "#6b7280",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      borderBottom: "2px solid transparent",
    },
    featuredSection: {
      padding: "3rem 0",
    },
    featuredContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    featuredTitle: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "2rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "box-shadow 0.3s",
    },
    cardImage: {
      height: "12rem",
      backgroundColor: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
    },
    cardContent: {
      padding: "1rem",
    },
    cardType: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
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
      color: "#2563eb",
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
    },
    footer: {
      backgroundColor: "#1f2937",
      color: "white",
      padding: "2rem 0",
    },
    footerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 1rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
    },
    footerSection: {
      marginBottom: "1rem",
    },
    footerTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    footerSubtitle: {
      fontWeight: "600",
      marginBottom: "1rem",
    },
    footerText: {
      color: "#9ca3af",
    },
    footerList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    footerListItem: {
      marginBottom: "0.5rem",
    },
    footerLink: {
      color: "#9ca3af",
      textDecoration: "none",
      cursor: "pointer",
    },
    footerBottom: {
      borderTop: "1px solid #374151",
      marginTop: "2rem",
      paddingTop: "2rem",
      textAlign: "center",
      color: "#9ca3af",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div
            style={styles.logo}
            onClick={handleLogoClick}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={styles.logoIcon}>🏠</span>
            <span>GharBazaar</span>
          </div>

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
                >
                  Properties
                </span>
              </li>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                >
                  About
                </span>
              </li>
              <li>
                <span
                  style={styles.navLink}
                  onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                  onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                >
                  Contact
                </span>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button style={styles.mobileMenuBtn}>
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
                d="M4 6h16M4 12h16M4 18h16"
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
                      display: "flex",
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

      {/* Filter Tabs */}
      <section style={styles.filterTabs}>
        <div style={styles.filterTabsContent}>
          {["Room", "Flat", "Land", "House"].map((tab) => (
            <button key={tab} style={styles.filterTab}>
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredContent}>
          <h2 style={styles.featuredTitle}>Featured Listings</h2>

          <div style={styles.grid}>
            {featuredListings.map((listing) => (
              <div key={listing.id} style={styles.card}>
                <div style={styles.cardImage}>
                  <span>📷 Photo</span>
                </div>
                <div style={styles.cardContent}>
                  <span style={styles.cardType}>{listing.type}</span>
                  <h3 style={styles.cardTitle}>{listing.title}</h3>
                  <p style={styles.cardLocation}>{listing.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.viewAllBtn}>
            <a href="#" style={styles.viewAllLink}>
              View all listings →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <div style={styles.footerTitle}>🏠 GharBazaar</div>
            <p style={styles.footerText}>
              Your trusted platform for finding homes in Nepal.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  About Us
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Contact
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Help
                </a>
              </li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Property Types</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Rooms
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Flats
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Houses
                </a>
              </li>
              <li style={styles.footerListItem}>
                <a href="#" style={styles.footerLink}>
                  Land
                </a>
              </li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Contact Info</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>Email: info@gharbazaar.com</li>
              <li style={styles.footerListItem}>Phone: +977-1-4444444</li>
              <li style={styles.footerListItem}>Kathmandu, Nepal</li>
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
