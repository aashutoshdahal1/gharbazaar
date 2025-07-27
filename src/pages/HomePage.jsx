import React, { useState } from "react";

export default function GharBazaarHomepage() {
  const [searchQuery, setSearchQuery] = useState("");

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
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "4rem",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#111827",
    },
    nav: {
      display: "flex",
      gap: "2rem",
    },
    navLink: {
      color: "#6b7280",
      textDecoration: "none",
      cursor: "pointer",
    },
    authButtons: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    signupBtn: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
    },
    loginBtn: {
      color: "#6b7280",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #d1d5db",
      backgroundColor: "white",
      cursor: "pointer",
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
          <div style={styles.logo}>🏠 GharBazaar</div>

          {/* Navigation */}
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink}>
              About
            </a>
            <a href="#" style={styles.navLink}>
              Contact
            </a>
            <a href="#" style={styles.navLink}>
              Help
            </a>
          </nav>

          {/* Auth Buttons */}
          <div style={styles.authButtons}>
            <button style={styles.signupBtn}>Sign up</button>
            <button style={styles.loginBtn}>Login</button>
            <div style={{ fontSize: "1.25rem", cursor: "pointer" }}>👤</div>
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
        <div style={styles.fooguterBottom}>
          <p>&copy; 2025 GharBazaar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
