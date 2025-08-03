import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";

const PropertyListing = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [propertyType, setPropertyType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProperties, setTotalProperties] = useState(0);

  const API_BASE_URL = url + "api";

  // Fetch all properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties`);
        const data = await response.json();

        if (data.success) {
          setProperties(data.data);
          setFilteredProperties(data.data);
          setTotalProperties(data.data.length);
        } else {
          setError("Failed to fetch properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("An error occurred while fetching properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [API_BASE_URL]);

  // Filter properties based on criteria
  useEffect(() => {
    let filtered = properties.filter((property) => {
      const priceInRange =
        property.price >= priceRange[0] && property.price <= priceRange[1];

      const typeMatch =
        !propertyType ||
        property.property_type?.toLowerCase() === propertyType.toLowerCase();

      const purposeMatch =
        !purpose || property.purpose?.toLowerCase() === purpose.toLowerCase();

      const searchMatch =
        !searchQuery ||
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return priceInRange && typeMatch && purposeMatch && searchMatch;
    });

    // Sort properties by price (optional)
    filtered.sort((a, b) => {
      if (purpose === "rent") {
        return a.price - b.price; // Ascending for rent
      }
      return b.price - a.price; // Descending for sale
    });

    setFilteredProperties(filtered);
    setTotalProperties(filtered.length);
  }, [properties, priceRange, propertyType, purpose, searchQuery]);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;

    // Ensure min is not greater than max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setPriceRange(newRange);
  };

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setPropertyType("");
    setPurpose("");
    setSearchQuery("");
  };

  const handleSearch = () => {
    // Search functionality is handled by useEffect above
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleAddProperty = () => {
    navigate("/add-listing");
  };

  const handleViewListing = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleToggleFavorite = (propertyId) => {
    // TODO: Implement favorites functionality
    console.log("Toggle favorite for property:", propertyId);
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
      cursor: "pointer",
    },
    nav: {
      display: "flex",
      gap: "32px",
    },
    navLink: {
      color: "#374151",
      textDecoration: "none",
      fontWeight: "500",
      cursor: "pointer",
    },
    navLinkInactive: {
      color: "#6b7280",
      textDecoration: "none",
      cursor: "pointer",
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
      cursor: "pointer",
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
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #e5e7eb",
    },
    propertyCardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    },
    imageContainer: {
      position: "relative",
      overflow: "hidden",
    },
    propertyImage: {
      width: "100%",
      height: "220px",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    propertyBadge: {
      position: "absolute",
      top: "12px",
      left: "12px",
      backgroundColor: "#10b981",
      color: "white",
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    heartButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "50%",
      border: "none",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#ef4444",
    },
    heartButtonHover: {
      backgroundColor: "white",
      transform: "scale(1.1)",
    },
    cardContent: {
      padding: "20px",
    },
    cardTitle: {
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
      fontSize: "18px",
      lineHeight: "1.3",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    cardLocation: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      fontWeight: "500",
    },
    cardDescription: {
      color: "#9ca3af",
      fontSize: "13px",
      marginBottom: "16px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      lineHeight: "1.4",
    },
    cardFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    price: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#059669",
      display: "flex",
      flexDirection: "column",
    },
    priceLabel: {
      fontSize: "11px",
      fontWeight: "500",
      color: "#6b7280",
      textTransform: "uppercase",
    },
    typeTag: {
      fontSize: "11px",
      color: "#374151",
      backgroundColor: "#f3f4f6",
      padding: "6px 10px",
      borderRadius: "20px",
      fontWeight: "600",
      border: "1px solid #e5e7eb",
    },
    cardActions: {
      display: "flex",
      gap: "8px",
    },
    cardViewButton: {
      flex: 1,
      backgroundColor: "#2563eb",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    contactButton: {
      backgroundColor: "#f8fafc",
      color: "#374151",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
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
            <div style={styles.logo} onClick={handleGoHome}>
              GharBazaar
            </div>
            <nav style={styles.nav}>
              <span style={styles.navLink} onClick={() => setPurpose("rent")}>
                Rent
              </span>
              <span
                style={
                  purpose === "sell" ? styles.navLink : styles.navLinkInactive
                }
                onClick={() => setPurpose("sell")}
              >
                Buy
              </span>
              <span style={styles.navLinkInactive} onClick={handleAddProperty}>
                Sell
              </span>
              <span style={styles.navLinkInactive} onClick={handleAddProperty}>
                Manage Property
              </span>
            </nav>
          </div>
          <div style={styles.rightHeader}>
            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search properties..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button style={styles.postButton} onClick={handleAddProperty}>
              Post Property
            </button>
            <div style={styles.userIcon} onClick={() => navigate("/dashboard")}>
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={styles.sidebarTitle}>Filters</h3>
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "#d1d5db";
              }}
            >
              Reset All
            </button>
          </div>

          {/* Price Range */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Price Range (NPR)</label>
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "12px",
              }}
            >
              <div style={styles.priceInputs}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    style={{
                      ...styles.priceInput,
                      width: "100%",
                      padding: "8px 12px",
                    }}
                    placeholder="0"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    style={{
                      ...styles.priceInput,
                      width: "100%",
                      padding: "8px 12px",
                    }}
                    placeholder="100000"
                  />
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  style={{
                    ...styles.rangeSlider,
                    width: "100%",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#9ca3af",
                    marginTop: "4px",
                  }}
                >
                  <span>₹0</span>
                  <span>₹1L+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Property Type</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setPropertyType("")}
                style={
                  propertyType === ""
                    ? {
                        ...styles.typeButtonActive,
                        position: "relative",
                        overflow: "hidden",
                      }
                    : styles.typeButton
                }
              >
                All Types
              </button>
              {["house", "flat", "room", "land"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  style={
                    propertyType === type
                      ? {
                          ...styles.typeButtonActive,
                          position: "relative",
                          overflow: "hidden",
                        }
                      : styles.typeButton
                  }
                  onMouseEnter={(e) => {
                    if (propertyType !== type) {
                      e.target.style.backgroundColor = "#f8fafc";
                      e.target.style.borderColor = "#9ca3af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (propertyType !== type) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  {type === "flat"
                    ? "🏢"
                    : type === "house"
                    ? "🏠"
                    : type === "room"
                    ? "🚪"
                    : "🌍"}{" "}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Listing Purpose</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setPurpose("")}
                style={
                  purpose === "" ? styles.typeButtonActive : styles.typeButton
                }
              >
                🔍 All Purposes
              </button>
              <button
                onClick={() => setPurpose("rent")}
                style={
                  purpose === "rent"
                    ? styles.typeButtonActive
                    : styles.typeButton
                }
              >
                🏠 For Rent
              </button>
              <button
                onClick={() => setPurpose("sell")}
                style={
                  purpose === "sell"
                    ? styles.typeButtonActive
                    : styles.typeButton
                }
              >
                💰 For Sale
              </button>
              <button
                onClick={() => setPurpose("buy")}
                style={
                  purpose === "buy"
                    ? styles.typeButtonActive
                    : styles.typeButton
                }
              >
                🛒 Wanted to Buy
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              backgroundColor: "#f0f9ff",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e0f2fe",
              marginTop: "20px",
            }}
          >
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#0369a1",
                marginBottom: "8px",
              }}
            >
              Search Results
            </h4>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#0c4a6e",
                marginBottom: "4px",
              }}
            >
              {totalProperties}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#0369a1",
              }}
            >
              Properties found
            </p>
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
                  Nepal Properties
                </h1>
                <p style={styles.subtitle}>
                  {totalProperties} properties found
                </p>
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

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                fontSize: "18px",
                color: "#6b7280",
              }}
            >
              Loading properties...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "400px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button
                onClick={handleAddProperty}
                style={{
                  ...styles.postButton,
                  marginTop: "16px",
                  padding: "12px 24px",
                }}
              >
                Add First Property
              </button>
            </div>
          ) : (
            /* Property Grid */
            <div style={styles.propertyGrid}>
              {filteredProperties.map((property) => {
                let images = [];
                try {
                  images = property.images ? JSON.parse(property.images) : [];
                } catch (error) {
                  console.error("Error parsing images JSON:", error);
                  images = [];
                }
                const firstImage = images.length > 0 ? images[0] : null;

                return (
                  <div
                    key={property.id}
                    style={styles.propertyCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0, 0, 0, 0.15)";
                      const image = e.currentTarget.querySelector("img");
                      if (image) image.style.transform = "scale(1.05)";
                      const overlay =
                        e.currentTarget.querySelector(".image-overlay");
                      if (overlay) overlay.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.1)";
                      const image = e.currentTarget.querySelector("img");
                      if (image) image.style.transform = "scale(1)";
                      const overlay =
                        e.currentTarget.querySelector(".image-overlay");
                      if (overlay) overlay.style.opacity = "0";
                    }}
                  >
                    <div style={styles.imageContainer}>
                      {firstImage ? (
                        <img
                          src={`${url.replace(/\/$/, "")}${firstImage}`}
                          alt={property.title}
                          style={styles.propertyImage}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          ...styles.propertyImage,
                          display: firstImage ? "none" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f3f4f6",
                          color: "#9ca3af",
                          fontSize: "14px",
                        }}
                      >
                        📷 No Image Available
                      </div>
                      <div
                        className="image-overlay"
                        style={styles.imageOverlay}
                      ></div>
                      <div style={styles.propertyBadge}>{property.purpose}</div>
                      <button
                        style={styles.heartButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(property.id);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "white";
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor =
                            "rgba(255, 255, 255, 0.9)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        <span>♡</span>
                      </button>
                    </div>
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{property.title}</h3>
                      <p style={styles.cardLocation}>
                        <span style={{ marginRight: "6px" }}>📍</span>
                        {property.location}
                      </p>
                      {property.description && (
                        <p style={styles.cardDescription}>
                          {property.description}
                        </p>
                      )}
                      <div style={styles.cardFooter}>
                        <div style={styles.price}>
                          <span style={styles.priceLabel}>
                            {property.purpose === "rent"
                              ? "Monthly Rent"
                              : "Price"}
                          </span>
                          Rs {parseInt(property.price).toLocaleString()}
                          {property.purpose === "rent" ? "/mo" : ""}
                        </div>
                        <span style={styles.typeTag}>
                          {property.property_type?.charAt(0).toUpperCase() +
                            property.property_type?.slice(1)}
                        </span>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.cardViewButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewListing(property.id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#1d4ed8";
                            e.target.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#2563eb";
                            e.target.style.transform = "translateY(0)";
                          }}
                        >
                          View Details
                        </button>
                        <button
                          style={styles.contactButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement contact functionality
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f1f5f9";
                            e.target.style.borderColor = "#94a3b8";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#f8fafc";
                            e.target.style.borderColor = "#d1d5db";
                          }}
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
