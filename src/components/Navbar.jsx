import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
import { LogoDisplay } from "../utils/logoManager.jsx";

const Navbar = ({
  showDashboardButton = false,
  showViewDashboardButton = false,
  showMessagesButton = false,
  showBackButton = false,
  backButtonText = "← Back",
  backButtonAction = null,
  showHomeAndProperties = true,
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!(token && user));
    };

    checkLoginStatus();

    // Listen for storage changes (login/logout events)
    window.addEventListener("storage", checkLoginStatus);

    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount();

      // Poll for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${url}api/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const totalUnread = data.data.reduce(
          (sum, conv) => sum + (conv.unread_count || 0),
          0
        );
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

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
          <LogoDisplay
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1e40af",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            size="medium"
            onClick={() => navigate("/")}
          />
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
          {/* Message Icon for logged-in users */}
          {isLoggedIn && (
            <>
              <div
                style={{
                  position: "relative",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid transparent",
                }}
                onClick={() => navigate("/messages")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "transparent";
                }}
                title="Messages"
              >
                <span style={{ fontSize: "20px" }}>💬</span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      borderRadius: "50%",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "2px 4px",
                      border: "2px solid white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>

              {/* Favorites Icon */}
              <div
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid transparent",
                }}
                onClick={() => navigate("/favorites")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "transparent";
                }}
                title="My Favorites"
              >
                <span style={{ fontSize: "20px" }}>❤️</span>
              </div>
            </>
          )}

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
          {showMessagesButton && (
            <button
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => navigate("/messages")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#10b981")}
            >
              💬 Messages
            </button>
          )}
          {showViewDashboardButton && (
            <button
              style={{
                backgroundColor: "#1e40af",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => navigate("/dashboard")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e40af")}
            >
              View Dashboard
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
