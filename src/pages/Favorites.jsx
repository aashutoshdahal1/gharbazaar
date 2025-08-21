import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import url from "../apiurl";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = url + "api";

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(data.data);
      } else {
        setError(data.message || "Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("An error occurred while fetching favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/favorites/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(favorites.filter((fav) => fav.listing_id !== listingId));
      } else {
        alert(data.message || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("An error occurred while removing favorite");
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif",
    },
    mainContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#111827",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      border: "1px solid #e5e7eb",
    },
    imageContainer: {
      position: "relative",
      height: "200px",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    removeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      backgroundColor: "rgba(239, 68, 68, 0.9)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    cardContent: {
      padding: "20px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
    },
    cardLocation: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    price: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#059669",
      marginBottom: "16px",
    },
    viewButton: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
    emptyState: {
      textAlign: "center",
      padding: "64px 20px",
      color: "#6b7280",
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "16px",
    },
    emptyTitle: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "16px",
      marginBottom: "24px",
    },
    browseButton: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  if (loading) {
    return (
      <>
        <Navbar showViewDashboardButton={true} />
        <div style={styles.container}>
          <div style={styles.mainContent}>
            <div style={{ textAlign: "center", padding: "64px 20px" }}>
              <p style={{ fontSize: "18px", color: "#6b7280" }}>
                Loading favorites...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showViewDashboardButton={true} />
      <div style={styles.container}>
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>My Favorites</h1>
            <p style={styles.subtitle}>
              {favorites.length}{" "}
              {favorites.length === 1 ? "property" : "properties"} saved
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {favorites.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>❤️</div>
              <h2 style={styles.emptyTitle}>No favorites yet</h2>
              <p style={styles.emptyText}>
                Start browsing properties and save your favorites to see them
                here.
              </p>
              <button
                style={styles.browseButton}
                onClick={() => navigate("/filter")}
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {favorites.map((favorite) => {
                let images = [];
                let coverImage = null;

                try {
                  images = favorite.images ? JSON.parse(favorite.images) : [];
                  if (images.length > 0 && typeof images[0] === "object") {
                    coverImage = images.find((img) => img.isCover) || images[0];
                  } else if (images.length > 0) {
                    coverImage = { url: images[0] };
                  }
                } catch (error) {
                  console.error("Error parsing images JSON:", error);
                  images = [];
                }

                return (
                  <div key={favorite.id} style={styles.card}>
                    <div style={styles.imageContainer}>
                      {coverImage ? (
                        <img
                          src={`${url.replace(/\/$/, "")}${coverImage.url}`}
                          alt={favorite.title}
                          style={styles.image}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          ...styles.image,
                          display: coverImage ? "none" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f3f4f6",
                          color: "#9ca3af",
                          fontSize: "14px",
                        }}
                      >
                        📷 No Image Available
                      </div>
                      <button
                        style={styles.removeButton}
                        onClick={() => removeFavorite(favorite.listing_id)}
                        title="Remove from favorites"
                      >
                        ×
                      </button>
                    </div>
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{favorite.title}</h3>
                      <p style={styles.cardLocation}>
                        <span>📍</span>
                        {favorite.location}
                      </p>
                      <div style={styles.price}>
                        Rs {parseInt(favorite.price).toLocaleString()}
                        {favorite.purpose === "rent" ? "/month" : ""}
                      </div>
                      <button
                        style={styles.viewButton}
                        onClick={() => handleViewProperty(favorite.listing_id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
