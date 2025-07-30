import React from "react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
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
    comingSoon: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "48px",
      textAlign: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    comingSoonText: {
      fontSize: "24px",
      color: "#121516",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    comingSoonSubtext: {
      fontSize: "16px",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Add New Property</h1>
        <p style={styles.subtitle}>List your property on GharBazaar</p>
      </div>

      <div style={styles.comingSoon}>
        <h2 style={styles.comingSoonText}>Coming Soon!</h2>
        <p style={styles.comingSoonSubtext}>
          The property listing feature is currently under development.
        </p>
      </div>
    </div>
  );
};

export default AddProperty;
