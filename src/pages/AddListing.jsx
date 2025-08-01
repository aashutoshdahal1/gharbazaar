import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    propertyType: "",
    address: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  // Check for user authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        JSON.parse(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Selected Images:", selectedImages);
    // Handle form submission logic here
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/dashboard");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #f1f3f4",
      paddingLeft: isMobile ? "1rem" : "2.5rem",
      paddingRight: isMobile ? "1rem" : "2.5rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      color: "#121516",
    },
    logoIcon: {
      width: "1rem",
      height: "1rem",
    },
    logoText: {
      color: "#121516",
      fontSize: "1.125rem",
      fontWeight: "bold",
      lineHeight: "1.2",
      letterSpacing: "-0.015em",
      cursor: "pointer",
    },
    navSection: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      gap: isMobile ? "1rem" : "2rem",
    },
    navLinks: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: "2.25rem",
    },
    navLink: {
      color: "#121516",
      fontSize: "0.875rem",
      fontWeight: "500",
      lineHeight: "1.5",
      textDecoration: "none",
      cursor: "pointer",
    },
    postPropertyBtn: {
      display: isMobile ? "none" : "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "2.5rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      backgroundColor: "#b2d1e5",
      color: "#121516",
      fontSize: "0.875rem",
      fontWeight: "bold",
      lineHeight: "1.5",
      letterSpacing: "0.015em",
      border: "none",
    },
    profileAvatar: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      aspectRatio: "1",
      borderRadius: "50%",
      width: "2.5rem",
      height: "2.5rem",
      cursor: "pointer",
    },
    mainContent: {
      paddingLeft: isMobile ? "1rem" : "10rem",
      paddingRight: isMobile ? "1rem" : "10rem",
      display: "flex",
      flex: 1,
      justifyContent: "center",
      paddingTop: "1.25rem",
      paddingBottom: "1.25rem",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "960px",
      flex: 1,
    },
    pageTitle: {
      color: "#121516",
      fontSize: isMobile ? "1.5rem" : "2rem",
      fontWeight: "bold",
      lineHeight: "1.2",
      minWidth: isMobile ? "auto" : "18rem",
      padding: "1rem",
    },
    formSection: {
      display: "flex",
      maxWidth: "480px",
      flexWrap: "wrap",
      alignItems: "flex-end",
      gap: "1rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      minWidth: "10rem",
      flex: 1,
    },
    label: {
      color: "#121516",
      fontSize: "1rem",
      fontWeight: "500",
      lineHeight: "1.5",
      paddingBottom: "0.5rem",
    },
    input: {
      display: "flex",
      width: "100%",
      minWidth: 0,
      flex: 1,
      resize: "none",
      overflow: "hidden",
      borderRadius: "0.75rem",
      color: "#121516",
      border: "1px solid #dde1e3",
      backgroundColor: "white",
      height: "3.5rem",
      paddingLeft: "0.9375rem",
      paddingRight: "0.9375rem",
      fontSize: "1rem",
      fontWeight: "normal",
      lineHeight: "1.5",
      outline: "none",
    },
    select: {
      display: "flex",
      width: "100%",
      minWidth: 0,
      flex: 1,
      resize: "none",
      overflow: "hidden",
      borderRadius: "0.75rem",
      color: "#121516",
      border: "1px solid #dde1e3",
      backgroundColor: "white",
      height: "3.5rem",
      paddingLeft: "0.9375rem",
      paddingRight: "0.9375rem",
      fontSize: "1rem",
      fontWeight: "normal",
      lineHeight: "1.5",
      outline: "none",
      backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(106,120,129)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.75rem center",
      backgroundSize: "1.5rem",
      appearance: "none",
    },
    imagePreview: {
      display: "flex",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    },
    imageContainer: {
      width: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      aspectRatio: "16/9",
      borderRadius: "0.75rem",
      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNR1jTmbMYClfh7ZJ_PpUVqfrGI0ScAjBhnFamRYxmMr6nwI-CyQuaTeMnLsFIbUgcZizBkxtVifzvwwbReOjeutGFrz-6xmHPlpWt74V9fXmAj5tF27Gr6aE_oSpew0yIGblX2ibHl-E4dvNAeIfvsyBvJoTefurJi1WULiLgxMawh0xQ6PIbYsrmGiXp3PzAWGk1KUqifCuD2rgqbrV6znCiZiU1tl3FYngzmru9BzjIGX0R5glvggTI2LTEm5evYYUfHaksvuyw")`,
    },
    uploadSection: {
      color: "#121516",
      fontSize: "1.125rem",
      fontWeight: "bold",
      lineHeight: "1.2",
      letterSpacing: "-0.015em",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingBottom: "0.5rem",
      paddingTop: "1rem",
    },
    uploadArea: {
      display: "flex",
      flexDirection: "column",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
    },
    uploadBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1.5rem",
      borderRadius: "0.75rem",
      border: "2px dashed #dde1e3",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      paddingTop: "3.5rem",
      paddingBottom: "3.5rem",
    },
    uploadText: {
      display: "flex",
      maxWidth: "480px",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
    },
    uploadTitle: {
      color: "#121516",
      fontSize: "1.125rem",
      fontWeight: "bold",
      lineHeight: "1.2",
      letterSpacing: "-0.015em",
      maxWidth: "480px",
      textAlign: "center",
    },
    uploadSubtitle: {
      color: "#121516",
      fontSize: "0.875rem",
      fontWeight: "normal",
      lineHeight: "1.5",
      maxWidth: "480px",
      textAlign: "center",
    },
    uploadBtn: {
      display: "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "2.5rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      backgroundColor: "#f1f3f4",
      color: "#121516",
      fontSize: "0.875rem",
      fontWeight: "bold",
      lineHeight: "1.5",
      letterSpacing: "0.015em",
      border: "none",
    },
    submitSection: {
      display: "flex",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    },
    submitBtn: {
      display: "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "2.5rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      flex: 1,
      backgroundColor: "#b2d1e5",
      color: "#121516",
      fontSize: "0.875rem",
      fontWeight: "bold",
      lineHeight: "1.5",
      letterSpacing: "0.015em",
      border: "none",
    },
    hiddenInput: {
      display: "none",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 style={styles.logoText} onClick={handleLogoClick}>
            GharBazaar
          </h2>
        </div>
        <div style={styles.navSection}>
          <div style={styles.navLinks}>
            <span style={styles.navLink}>Rent</span>
            <span style={styles.navLink}>Buy</span>
            <span style={styles.navLink}>Sell</span>
            <span style={styles.navLink}>Loans</span>
            <span style={styles.navLink}>Property Management</span>
          </div>
          <button
            style={styles.postPropertyBtn}
            onClick={() => navigate("/add-listing")}
          >
            <span>Post Property</span>
          </button>
          {isLoggedIn ? (
            <div
              style={{
                ...styles.profileAvatar,
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsDdqK0DW8ffxkrViZL370S22f1nbzWe2EkAvRs_OxJnN6GnLe17PaYrMKPRBSChQd2jyXZJRGllDoDZwh8zygGO_x1UMdLpEjSlSGU8tY-dXd5LCmUOB-f8ns2ican9P0Nahv5Bkd27zPRYs9bQ-6HysyUxbNY85pS8fnHS-tx8F9AOOGuaVUeuK1YD4HM7PkrvAjUWt-hoqgWMXRxMAOzSsG_zCKinV1BsgYStvoxWnFd82cRO5wYmiIzXzWWROV6O1YBFrsT9TA")`,
              }}
              onClick={handleProfileClick}
              title="Profile"
            />
          ) : (
            <button
              style={styles.postPropertyBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentContainer}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "1rem",
            }}
          >
            <p style={styles.pageTitle}>Add New Listing</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 2BHK Apartment in Kathmandu"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Price Field */}
            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (per month)</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 20,000"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Property Type Field */}
            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="">Select Type</option>
                  <option value="room">Room</option>
                  <option value="flat">Flat</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>

            {/* Address Field */}
            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., Thamel, Kathmandu"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Image Preview */}
            <div style={styles.imagePreview}>
              <div style={styles.imageContainer} />
            </div>

            {/* Upload Images Section */}
            <h3 style={styles.uploadSection}>Upload Images</h3>
            <div style={styles.uploadArea}>
              <div style={styles.uploadBox}>
                <div style={styles.uploadText}>
                  <p style={styles.uploadTitle}>Drag and drop images here</p>
                  <p style={styles.uploadSubtitle}>Or click to upload</p>
                </div>
                <label htmlFor="image-upload" style={styles.uploadBtn}>
                  <span>Upload</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.hiddenInput}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={styles.submitSection}>
              <button type="submit" style={styles.submitBtn}>
                <span>Submit Listing</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
