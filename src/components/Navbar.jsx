import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  showDashboardButton = false,
  showBackButton = false,
  backButtonText = "← Back",
  backButtonAction = null,
  showHomeAndProperties = true,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <header
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #e5e7eb",
        padding: "12px 0",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1e40af",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => navigate("/")}
          >
            🏠 GharBazaar
          </div>
          {showHomeAndProperties && (
            <nav style={{ display: "flex", gap: "20px" }}>
              <span
                style={{
                  color: "#4b5563",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.2s ease",
                }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
              >
                Home
              </span>
              <span
                style={{
                  color: "#4b5563",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  transition: "all 0.2s ease",
                }}
                onClick={() => navigate("/filter")}
                onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
              >
                Properties
              </span>
            </nav>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {showBackButton && (
            <button
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={handleBackClick}
            >
              {backButtonText}
            </button>
          )}
          {showDashboardButton && (
            <button
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
