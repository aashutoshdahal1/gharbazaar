import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
import Navbar from "../components/Navbar";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    currentPassword: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = url + "api";

  // Load current user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        fullName: parsedUser.name || "",
      }));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again");
        navigate("/login");
        return;
      }

      // Validate name
      if (!formData.fullName.trim()) {
        alert("Name is required");
        setIsLoading(false);
        return;
      }

      // If password change is requested, validate password fields
      if (formData.password || formData.currentPassword) {
        if (!formData.currentPassword) {
          alert(
            "Please enter your current password to change to a new password."
          );
          setIsLoading(false);
          return;
        }

        if (!formData.password) {
          alert("Please enter a new password.");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          alert("New password must be at least 6 characters long.");
          setIsLoading(false);
          return;
        }
      }

      // Update profile name
      const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.fullName.trim(),
        }),
      });

      const profileData = await profileResponse.json();

      if (!profileData.success) {
        alert(profileData.message || "Failed to update profile");
        setIsLoading(false);
        return;
      }

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(profileData.data.user));

      // If password change is requested, update password
      if (formData.password && formData.currentPassword) {
        const passwordResponse = await fetch(
          `${API_BASE_URL}/auth/change-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword: formData.currentPassword,
              newPassword: formData.password,
            }),
          }
        );

        const passwordData = await passwordResponse.json();

        if (!passwordData.success) {
          alert(passwordData.message || "Failed to update password");
          setIsLoading(false);
          return;
        }
      }

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "2rem 1rem",
    },
    wrapper: {
      maxWidth: "42rem",
      margin: "0 auto",
    },
    backButton: {
      marginBottom: "1.5rem",
      display: "inline-flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      backgroundColor: "#ffffff",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "all 0.2s",
      textDecoration: "none",
    },
    backButtonHover: {
      backgroundColor: "#f9fafb",
    },
    mainCard: {
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      border: "1px solid #e5e7eb",
      padding: "2rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "2rem",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    fieldContainer: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      outline: "none",
      transition: "all 0.2s",
      color: "#111827",
      backgroundColor: "#ffffff",
      fontSize: "1rem",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      paddingTop: "1rem",
    },
    saveButton: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.75rem 1.5rem",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      fontWeight: "500",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "1rem",
    },
    saveButtonHover: {
      backgroundColor: "#1d4ed8",
    },
    saveButtonDisabled: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    icon: {
      width: "1rem",
      height: "1rem",
      marginRight: "0.5rem",
    },
    spinner: {
      width: "1rem",
      height: "1rem",
      marginRight: "0.5rem",
      border: "2px solid transparent",
      borderTop: "2px solid #ffffff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <>
      <Navbar
        showBackButton={true}
        backButtonText="← Back to Profile"
        backButtonAction={handleBackClick}
      />
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Main Content */}
          <div style={styles.mainCard}>
            <h1 style={styles.title}>Edit Profile</h1>

            <div style={styles.formContainer}>
              {/* Full Name */}
              <div style={styles.fieldContainer}>
                <label htmlFor="fullName" style={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter your full name"
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.inputFocus.borderColor;
                    e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styles.input.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Current Password */}
              <div style={styles.fieldContainer}>
                <label htmlFor="currentPassword" style={styles.label}>
                  Current Password (Optional - only if changing password)
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter your current password"
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.inputFocus.borderColor;
                    e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styles.input.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* New Password */}
              <div style={styles.fieldContainer}>
                <label htmlFor="password" style={styles.label}>
                  New Password (Optional - only if changing password)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter new password"
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.inputFocus.borderColor;
                    e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styles.input.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Save Changes Button */}
              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  style={{
                    ...styles.saveButton,
                    ...(isLoading ? styles.saveButtonDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor =
                        styles.saveButtonHover.backgroundColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor =
                        styles.saveButton.backgroundColor;
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={styles.spinner}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        style={styles.icon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation for spinner */}
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    </>
  );
};

export default EditProfile;
