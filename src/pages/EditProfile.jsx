import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

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
      // Add your API call here to save the profile changes
      console.log("Saving profile changes:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              styles.backButtonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.backButton.backgroundColor;
          }}
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

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

            {/* Phone Number */}
            <div style={styles.fieldContainer}>
              <label htmlFor="phoneNumber" style={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your phone number"
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

            {/* Email */}
            <div style={styles.fieldContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your email address"
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

            {/* Password */}
            <div style={styles.fieldContainer}>
              <label htmlFor="password" style={styles.label}>
                Password
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
  );
};

export default EditProfile;
