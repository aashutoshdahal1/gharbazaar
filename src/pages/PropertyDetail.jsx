import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import url from "../apiurl";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const API_BASE_URL = url + "api";

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties/${id}`);
        const data = await response.json();

        if (data.success) {
          setProperty(data.data);
        } else {
          setError("Property not found");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("An error occurred while fetching property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, API_BASE_URL]);

  const images = property?.images
    ? (() => {
        try {
          const parsedImages = JSON.parse(property.images);
          // Handle new format with cover image info
          if (parsedImages.length > 0 && typeof parsedImages[0] === "object") {
            return parsedImages.map((img) => img.url);
          } else {
            // Old format - just array of strings
            return parsedImages;
          }
        } catch (error) {
          console.error("Error parsing images:", error);
          return [];
        }
      })()
    : [];

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
      padding: "16px 0",
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    backButton: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2563eb",
      cursor: "pointer",
    },
    mainContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    imageGallery: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    mainImage: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    thumbnails: {
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      paddingBottom: "8px",
    },
    thumbnail: {
      width: "80px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "6px",
      cursor: "pointer",
      border: "2px solid transparent",
      transition: "all 0.2s ease",
    },
    thumbnailActive: {
      border: "2px solid #2563eb",
    },
    propertyInfo: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "24px",
    },
    leftColumn: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#111827",
      marginBottom: "8px",
    },
    location: {
      fontSize: "16px",
      color: "#6b7280",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    price: {
      fontSize: "36px",
      fontWeight: "900",
      color: "#059669",
      marginBottom: "24px",
    },
    description: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#374151",
      marginBottom: "32px",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "32px",
    },
    detailItem: {
      padding: "16px",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    detailLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      marginBottom: "4px",
    },
    detailValue: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#111827",
    },
    contactCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    contactButton: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "12px",
    },
    mapContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      height: "400px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          Loading property details...
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={styles.container}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <h2>Property Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/filter")} style={styles.backButton}>
            ← Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate("/filter")} style={styles.backButton}>
            ← Back to Properties
          </button>
          <div style={styles.logo} onClick={() => navigate("/")}>
            GharBazaar
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Image Gallery */}
        {images.length > 0 ? (
          <div style={styles.imageGallery}>
            <img
              src={`${url.replace(/\/$/, "")}${images[currentImageIndex]}`}
              alt={property.title}
              style={styles.mainImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              style={{
                ...styles.mainImage,
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              📷 Image not available
            </div>
            {images.length > 1 && (
              <div style={styles.thumbnails}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={`${url.replace(/\/$/, "")}${image}`}
                      alt={`Property ${index + 1}`}
                      style={{
                        ...styles.thumbnail,
                        ...(index === currentImageIndex
                          ? styles.thumbnailActive
                          : {}),
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{
                        ...styles.thumbnail,
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f4f6",
                        color: "#9ca3af",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      📷
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.imageGallery}>
            <div
              style={{
                ...styles.mainImage,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              📷 No images available for this property
            </div>
          </div>
        )}

        {/* Property Information */}
        <div style={styles.propertyInfo}>
          {/* Left Column - Main Details */}
          <div style={styles.leftColumn}>
            <h1 style={styles.title}>{property.title}</h1>
            <p style={styles.location}>
              <span>📍</span>
              {property.location}
            </p>
            <div style={styles.price}>
              Rs {parseInt(property.price).toLocaleString()}
              {property.purpose === "rent" ? "/month" : ""}
            </div>

            {property.description && (
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "16px",
                  }}
                >
                  Description
                </h3>
                <p style={styles.description}>{property.description}</p>
              </div>
            )}

            {/* Property Details Grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Property Type</div>
                <div style={styles.detailValue}>
                  {property.property_type?.charAt(0).toUpperCase() +
                    property.property_type?.slice(1)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Purpose</div>
                <div style={styles.detailValue}>
                  {property.purpose?.charAt(0).toUpperCase() +
                    property.purpose?.slice(1)}
                </div>
              </div>
              {property.area && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Area</div>
                  <div style={styles.detailValue}>{property.area}</div>
                </div>
              )}
              {property.phone_number && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Contact Number</div>
                  <div style={styles.detailValue}>{property.phone_number}</div>
                </div>
              )}
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Listed On</div>
                <div style={styles.detailValue}>
                  {new Date(property.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Map */}
            {property.latitude && property.longitude && (
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "16px",
                  }}
                >
                  Location on Map
                </h3>
                <div style={styles.mapContainer}>
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={15}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[property.latitude, property.longitude]}
                    />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div style={styles.rightColumn}>
            <div style={styles.contactCard}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Contact Owner
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                Interested in this property? Get in touch with the owner.
              </p>
              {property.phone_number && (
                <button
                  style={styles.contactButton}
                  onClick={() =>
                    window.open(`tel:${property.phone_number}`, "_self")
                  }
                >
                  📞 Call {property.phone_number}
                </button>
              )}
              <button
                style={{
                  ...styles.contactButton,
                  backgroundColor: "#10b981",
                }}
              >
                💬 Send Message
              </button>
              <button
                style={{
                  ...styles.contactButton,
                  backgroundColor: "#f8fafc",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                }}
              >
                ❤️ Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
