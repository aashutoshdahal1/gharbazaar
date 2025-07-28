import React, { useState } from "react";

const PropertyListing = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [propertyType, setPropertyType] = useState("Apartment");
  const [roomType, setRoomType] = useState("");

  const properties = [
    {
      id: 1,
      title: "Cozy Apartment in Thamel",
      location: "Thamel, Kathmandu",
      price: 8000,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      type: "Apartment",
    },
    {
      id: 2,
      title: "Spacious House in Boudha",
      location: "Boudha, Kathmandu",
      price: 12000,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      type: "House",
    },
    {
      id: 3,
      title: "Condo with City View in Patan",
      location: "Patan, Lalitpur",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      type: "Condo",
    },
    {
      id: 4,
      title: "Townhouse in Lalitpur",
      location: "Lalitpur, Bagmati",
      price: 18000,
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      type: "Townhouse",
    },
  ];

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "64px",
    },
    leftHeader: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2563eb",
    },
    nav: {
      display: "flex",
      gap: "32px",
    },
    navLink: {
      color: "#374151",
      textDecoration: "none",
      fontWeight: "500",
    },
    navLinkInactive: {
      color: "#6b7280",
      textDecoration: "none",
    },
    rightHeader: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    searchContainer: {
      position: "relative",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    searchInput: {
      paddingLeft: "40px",
      paddingRight: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      fontSize: "14px",
    },
    postButton: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    userIcon: {
      width: "32px",
      height: "32px",
      backgroundColor: "#d1d5db",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    mainContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "24px 16px",
      display: "flex",
      gap: "24px",
    },
    sidebar: {
      width: "320px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      padding: "24px",
    },
    sidebarTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
    },
    filterSection: {
      marginBottom: "24px",
    },
    filterLabel: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "12px",
    },
    priceInputs: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    priceInput: {
      width: "80px",
      padding: "4px 8px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
    },
    rangeSlider: {
      flex: 1,
      height: "8px",
      backgroundColor: "#e5e7eb",
      borderRadius: "4px",
      outline: "none",
      cursor: "pointer",
    },
    propertyTypeGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
    },
    typeButton: {
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "white",
      color: "#374151",
      cursor: "pointer",
    },
    typeButtonActive: {
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "8px",
      border: "1px solid #2563eb",
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
      cursor: "pointer",
    },
    select: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      backgroundColor: "white",
      fontSize: "14px",
    },
    contentArea: {
      flex: 1,
    },
    locationHeader: {
      marginBottom: "24px",
    },
    locationTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleLeft: {
      display: "flex",
      flexDirection: "column",
    },
    mainTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      marginBottom: "4px",
    },
    locationIcon: {
      color: "#2563eb",
      marginRight: "8px",
    },
    subtitle: {
      color: "#6b7280",
    },
    viewToggle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    viewButton: {
      padding: "8px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "#9ca3af",
    },
    viewButtonActive: {
      padding: "8px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#dbeafe",
      color: "#2563eb",
      cursor: "pointer",
    },
    propertyGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
    },
    propertyCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "box-shadow 0.2s ease",
    },
    imageContainer: {
      position: "relative",
    },
    propertyImage: {
      width: "100%",
      height: "192px",
      objectFit: "cover",
    },
    heartButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "8px",
      backgroundColor: "white",
      borderRadius: "50%",
      border: "none",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    cardContent: {
      padding: "16px",
    },
    cardTitle: {
      fontWeight: "600",
      color: "#111827",
      marginBottom: "4px",
    },
    cardLocation: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
    },
    cardFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    price: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#111827",
    },
    typeTag: {
      fontSize: "12px",
      color: "#6b7280",
      backgroundColor: "#f3f4f6",
      padding: "4px 8px",
      borderRadius: "4px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "32px",
      gap: "8px",
    },
    pageButton: {
      width: "32px",
      height: "32px",
      borderRadius: "4px",
      border: "1px solid #d1d5db",
      backgroundColor: "white",
      color: "#374151",
      cursor: "pointer",
    },
    pageButtonActive: {
      width: "32px",
      height: "32px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#2563eb",
      color: "white",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.leftHeader}>
            <div style={styles.logo}>GharBazaar</div>
            <nav style={styles.nav}>
              <a href="#" style={styles.navLink}>
                Rent
              </a>
              <a href="#" style={styles.navLinkInactive}>
                Buy
              </a>
              <a href="#" style={styles.navLinkInactive}>
                Sell
              </a>
              <a href="#" style={styles.navLinkInactive}>
                Manage Property
              </a>
              <a href="#" style={styles.navLinkInactive}>
                Resources
              </a>
            </nav>
          </div>
          <div style={styles.rightHeader}>
            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search"
                style={styles.searchInput}
              />
            </div>
            <button style={styles.postButton}>Post Property</button>
            <div style={styles.userIcon}>
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Filters</h3>

          {/* Price Range */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Price range</label>
            <div style={styles.priceInputs}>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                style={styles.priceInput}
                placeholder="Min"
              />
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                style={styles.rangeSlider}
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                style={styles.priceInput}
                placeholder="Max"
              />
            </div>
          </div>

          {/* Property Type */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Property Type</label>
            <div style={styles.propertyTypeGrid}>
              {["Apartment", "House", "Condo", "Townhouse"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  style={
                    propertyType === type
                      ? styles.typeButtonActive
                      : styles.typeButton
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Distance</label>
            <select style={styles.select}>
              <option>Any</option>
              <option>Within 1 km</option>
              <option>Within 5 km</option>
              <option>Within 10 km</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.contentArea}>
          {/* Location Header */}
          <div style={styles.locationHeader}>
            <div style={styles.locationTitle}>
              <div style={styles.titleLeft}>
                <h1 style={styles.mainTitle}>
                  <span style={styles.locationIcon}>📍</span>
                  Kathmandu, Nepal
                </h1>
                <p style={styles.subtitle}>225 properties found</p>
              </div>
              <div style={styles.viewToggle}>
                <button
                  onClick={() => setViewMode("list")}
                  style={
                    viewMode === "list"
                      ? styles.viewButtonActive
                      : styles.viewButton
                  }
                >
                  <span>☰</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  style={
                    viewMode === "grid"
                      ? styles.viewButtonActive
                      : styles.viewButton
                  }
                >
                  <span>⊞</span>
                </button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div style={styles.propertyGrid}>
            {properties.map((property) => (
              <div key={property.id} style={styles.propertyCard}>
                <div style={styles.imageContainer}>
                  <img
                    src={property.image}
                    alt={property.title}
                    style={styles.propertyImage}
                  />
                  <button style={styles.heartButton}>
                    <span>♡</span>
                  </button>
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{property.title}</h3>
                  <p style={styles.cardLocation}>
                    <span style={{ marginRight: "4px" }}>📍</span>
                    {property.location}
                  </p>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>
                      Rs {property.price.toLocaleString()}/month
                    </span>
                    <span style={styles.typeTag}>{property.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                style={page === 1 ? styles.pageButtonActive : styles.pageButton}
              >
                {page}
              </button>
            ))}
            <span style={{ padding: "0 8px", color: "#6b7280" }}>...</span>
            <button style={styles.pageButton}>9</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
