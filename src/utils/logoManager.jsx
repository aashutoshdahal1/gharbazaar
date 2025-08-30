// Custom hook for managing global logo state
import { useState, useEffect } from "react";

// Default logo configuration
const DEFAULT_LOGO = {
  text: "🏠 GharBazaar",
  image: null,
  useImage: false,
};

export const useLogo = () => {
  const [logo, setLogo] = useState(DEFAULT_LOGO);

  useEffect(() => {
    // Load logo from localStorage on component mount
    const savedLogo = localStorage.getItem("siteLogo");
    if (savedLogo) {
      try {
        // If it's a data URL (uploaded image), use it as image
        if (savedLogo.startsWith("data:image/")) {
          setLogo({
            text: "🏠 GharBazaar",
            image: savedLogo,
            useImage: true,
          });
        } else {
          // Otherwise, treat as text logo
          setLogo({
            text: savedLogo,
            image: null,
            useImage: false,
          });
        }
      } catch (error) {
        console.error("Error loading logo:", error);
        setLogo(DEFAULT_LOGO);
      }
    }

    // Listen for logo changes
    const handleLogoChange = (e) => {
      if (e.key === "siteLogo") {
        const newLogoValue = e.newValue;
        if (newLogoValue) {
          if (newLogoValue.startsWith("data:image/")) {
            setLogo({
              text: "🏠 GharBazaar",
              image: newLogoValue,
              useImage: true,
            });
          } else {
            setLogo({
              text: newLogoValue,
              image: null,
              useImage: false,
            });
          }
        } else {
          setLogo(DEFAULT_LOGO);
        }
      }
    };

    // Listen for storage events (when logo is updated from admin panel)
    window.addEventListener("storage", handleLogoChange);

    // Also listen for custom logo update events
    const handleCustomLogoUpdate = (event) => {
      const { logoData } = event.detail;
      if (logoData) {
        if (logoData.startsWith("data:image/")) {
          setLogo({
            text: "🏠 GharBazaar",
            image: logoData,
            useImage: true,
          });
        } else {
          setLogo({
            text: logoData,
            image: null,
            useImage: false,
          });
        }
      }
    };

    window.addEventListener("logoUpdate", handleCustomLogoUpdate);

    return () => {
      window.removeEventListener("storage", handleLogoChange);
      window.removeEventListener("logoUpdate", handleCustomLogoUpdate);
    };
  }, []);

  // Function to update logo (can be called from admin panel)
  const updateLogo = (logoData) => {
    console.log("updateLogo called with:", logoData);
    localStorage.setItem("siteLogo", logoData);

    // Update local state immediately
    if (logoData.startsWith("data:image/")) {
      const newLogo = {
        text: "🏠 GharBazaar",
        image: logoData,
        useImage: true,
      };
      console.log("Setting image logo:", newLogo);
      setLogo(newLogo);
    } else {
      const newLogo = {
        text: logoData,
        image: null,
        useImage: false,
      };
      console.log("Setting text logo:", newLogo);
      setLogo(newLogo);
    }

    // Dispatch custom event to notify all components
    window.dispatchEvent(
      new CustomEvent("logoUpdate", {
        detail: { logoData },
      })
    );
  };

  return { logo, updateLogo };
};

// Logo display component
export const LogoDisplay = ({
  style = {},
  size = "medium",
  showText = true,
  onClick = null,
  // Optional overrides to control text and image sizes independently
  textSize = null,
  imageSize = null,
}) => {
  const { logo } = useLogo();

  console.log("LogoDisplay rendering with logo:", logo);

  const sizes = {
    small: { fontSize: "18px", imageSize: "24px" },
    medium: { fontSize: "24px", imageSize: "32px" },
    large: { fontSize: "32px", imageSize: "48px" },
  };

  const currentSize = sizes[size] || sizes.medium;

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  if (logo.useImage && logo.image) {
    console.log("Displaying image logo:", logo.image);
    return (
      <div style={containerStyle} onClick={onClick}>
        <img
          src={logo.image}
          alt="GharBazaar Logo"
          style={{
            height: imageSize || currentSize.imageSize,
            width: "auto",
            maxWidth: "200px",
            objectFit: "contain",
          }}
        />
        {showText && (
          <span
            style={{
              fontSize: textSize || currentSize.fontSize,
              fontWeight: "bold",
              color: "#1e40af",
            }}
          >
            GharBazaar
          </span>
        )}
      </div>
    );
  }

  console.log("Displaying text logo:", logo.text);
  return (
    <div style={containerStyle} onClick={onClick}>
      <span
        style={{
          fontSize: textSize || currentSize.fontSize,
          fontWeight: "bold",
          color: "#1e40af",
        }}
      >
        {logo.text || DEFAULT_LOGO.text}
      </span>
    </div>
  );
};
