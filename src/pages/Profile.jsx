import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
    profileCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    infoItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #f3f4f6",
    },
    infoLabel: {
      fontSize: "16px",
      color: "#6b7280",
      fontWeight: 500,
    },
    infoValue: {
      fontSize: "16px",
      color: "#121516",
      fontWeight: 600,
    },
    editButton: {
      backgroundColor: "#b2d1e5",
      color: "#121516",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "24px",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Manage your account information</p>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Name</span>
          <span style={styles.infoValue}>{user.name || "N/A"}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Email</span>
          <span style={styles.infoValue}>{user.email || "N/A"}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Account Type</span>
          <span style={styles.infoValue}>{user.role || "user"}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Member Since</span>
          <span style={styles.infoValue}>
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <button
          style={styles.editButton}
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
