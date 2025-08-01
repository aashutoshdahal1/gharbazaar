import React from "react";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "40px",
    },
    header: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#121516",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#6b7280",
    },
    backButton: {
      backgroundColor: "#b2d1e5",
      color: "#121516",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "20px",
    },
    emptyState: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "48px",
      textAlign: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    emptyText: {
      fontSize: "18px",
      color: "#6b7280",
      marginBottom: "16px",
    },
    addButton: {
      backgroundColor: "#b2d1e5",
      color: "#121516",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>My Listings</h1>
        <p style={styles.subtitle}>Manage your property listings</p>
      </div>

      <div style={styles.emptyState}>
        <p style={styles.emptyText}>You haven't created any listings yet.</p>
        <button
          style={styles.addButton}
          onClick={() => navigate("/add-property")}
        >
          Create Your First Listing
        </button>
      </div>
    </div>
  );
};

export default MyListings;
