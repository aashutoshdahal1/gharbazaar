import React, { useState } from "react";
import url from "../apiurl";

const SendMessage = ({ property, onClose, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = url + "api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to send messages");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: property.user_id,
          listing_id: property.id,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("");
        if (onMessageSent) {
          onMessageSent(data.data);
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("An error occurred while sending the message");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "16px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#6b7280",
      padding: "4px",
      borderRadius: "4px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    },
    textarea: {
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      minHeight: "120px",
      resize: "vertical",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease",
    },
    submitButton: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    submitButtonDisabled: {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
    },
    error: {
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "8px",
    },
    propertyInfo: {
      backgroundColor: "#f8fafc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    propertyTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "4px",
    },
    propertyLocation: {
      fontSize: "14px",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Send Message</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.propertyInfo}>
          <div style={styles.propertyTitle}>{property.title}</div>
          <div style={styles.propertyLocation}>📍 {property.location}</div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="message">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.textarea}
              placeholder="Write your message here..."
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
