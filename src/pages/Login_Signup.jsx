import React, { useState } from "react";

const GharBazaarAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    if (isLogin) {
      console.log("Logging in...");
    } else {
      console.log("Signing up...");
    }
  };

  const styles = {
    body: {
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: "#fff",
    },
    designRoot: {
      position: "relative",
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      flexDirection: "column",
      backgroundColor: "white",
      overflowX: "hidden",
    },
    layoutContainer: {
      display: "flex",
      height: "100%",
      flexGrow: 1,
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      whiteSpace: "nowrap",
      borderBottom: "1px solid #f1f3f4",
      padding: "12px 40px",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      color: "#121516",
    },
    logo: {
      width: "16px",
      height: "16px",
    },
    title: {
      color: "#121516",
      fontSize: "18px",
      fontWeight: "bold",
      lineHeight: "1.25",
      letterSpacing: "-0.015em",
    },
    navLinks: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      gap: "32px",
    },
    navLinkContainer: {
      display: "flex",
      alignItems: "center",
      gap: "36px",
    },
    navLink: {
      color: "#121516",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "normal",
      textDecoration: "none",
    },
    listPropertyButton: {
      display: "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "40px",
      padding: "0 16px",
      backgroundColor: "#b2d1e5",
      color: "#121516",
      fontSize: "14px",
      fontWeight: "bold",
      lineHeight: "normal",
      letterSpacing: "0.015em",
      border: "none",
    },
    mainContent: {
      padding: "20px 160px",
      display: "flex",
      flex: 1,
      justifyContent: "center",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      width: "512px",
      maxWidth: "512px",
      padding: "20px 0",
    },
    heading: {
      color: "#121516",
      letterSpacing: "0.025em",
      fontSize: "28px",
      fontWeight: "bold",
      lineHeight: "1.25",
      padding: "0 16px 12px",
      textAlign: "center",
      marginTop: "20px",
    },
    inputContainer: {
      display: "flex",
      maxWidth: "480px",
      flexWrap: "wrap",
      alignItems: "flex-end",
      gap: "16px",
      padding: "12px 16px",
    },
    inputLabel: {
      display: "flex",
      flexDirection: "column",
      minWidth: "160px",
      flex: 1,
    },
    inputField: {
      display: "flex",
      width: "100%",
      minWidth: 0,
      flex: 1,
      resize: "none",
      overflow: "hidden",
      borderRadius: "12px",
      color: "#121516",
      outline: "none",
      border: "1px solid #dde1e3",
      backgroundColor: "white",
      height: "56px",
      padding: "15px",
      fontSize: "16px",
      fontWeight: "normal",
      lineHeight: "normal",
    },
    selectField: {
      display: "flex",
      width: "100%",
      minWidth: 0,
      flex: 1,
      resize: "none",
      overflow: "hidden",
      borderRadius: "12px",
      color: "#121516",
      outline: "none",
      border: "1px solid #dde1e3",
      backgroundColor: "white",
      height: "56px",
      padding: "15px",
      fontSize: "16px",
      fontWeight: "normal",
      lineHeight: "normal",
      appearance: "none",
      backgroundImage:
        'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(106,120,129)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 15px center",
    },
    authButton: {
      display: "flex",
      minWidth: "84px",
      maxWidth: "480px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "9999px",
      height: "40px",
      padding: "0 16px",
      backgroundColor: "#b2d1e5",
      color: "#121516",
      fontSize: "14px",
      fontWeight: "bold",
      lineHeight: "normal",
      letterSpacing: "0.015em",
      border: "none",
      flex: 1,
    },
    toggleText: {
      color: "#6a7881",
      fontSize: "14px",
      fontWeight: "normal",
      lineHeight: "normal",
      padding: "12px 16px 4px",
      textAlign: "center",
      textDecoration: "underline",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.designRoot}>
      <div style={styles.layoutContainer}>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 style={styles.title}>GharBazaar</h2>
          </div>
          <div style={styles.navLinks}>
            <div style={styles.navLinkContainer}>
              <a style={styles.navLink} href="#">
                About
              </a>
              <a style={styles.navLink} href="#">
                Contact
              </a>
            </div>
            <button style={styles.listPropertyButton}>
              <span>List your property</span>
            </button>
          </div>
        </header>
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <h2 style={styles.heading}>
              {isLogin ? "Welcome Back to GharBazaar" : "Welcome to GharBazaar"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputContainer}>
                <label style={styles.inputLabel}>
                  <input
                    name="email"
                    placeholder="Email or Phone Number"
                    style={styles.inputField}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div style={styles.inputContainer}>
                <label style={styles.inputLabel}>
                  <input
                    name="password"
                    placeholder="Password"
                    style={styles.inputField}
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password"
                    required
                  />
                </label>
              </div>
              <div style={{ ...styles.inputContainer, paddingTop: 0 }}>
                <button type="submit" style={styles.authButton}>
                  <span>{isLogin ? "Log In" : "Sign Up"}</span>
                </button>
              </div>
            </form>
            <p style={styles.toggleText} onClick={toggleAuthMode}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GharBazaarAuth;


const HomeScreen = ()=>{
  return(
    <div>
      

    </div>

  )
}