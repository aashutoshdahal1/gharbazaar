import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5001/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/properties/my-listings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setListings(data.data);
        } else {
          setError(data.message || "Failed to fetch listings");
        }
      } catch (error) {
        console.error("Fetch listings error:", error);
        setError("An error occurred while fetching your listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setListings(listings.filter((listing) => listing.id !== id));
      } else {
        setError(data.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Delete listing error:", error);
      setError("An error occurred while deleting the listing");
    }
  };

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
    emptyState: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "48px",
      textAlign: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    emptyText: {
      fontSize: "18px",
      color: "#6b7280",
      marginBottom: "16px",
    },
    addButton: {
      backgroundColor: "#b2d1e5",
      color: "#121516",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
    },
    listingsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    listingCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
    },
    listingImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    noImage: {
      width: "100%",
      height: "200px",
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      fontSize: "14px",
    },
    listingTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#121516",
      marginBottom: "8px",
    },
    listingDetails: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "4px",
    },
    listingPrice: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#10b981",
      marginBottom: "12px",
    },
    listingActions: {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
    },
    editButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
    },
    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "12px 16px",
      borderRadius: "8px",
      margin: "16px 0",
      fontSize: "14px",
      textAlign: "center",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px",
      fontSize: "16px",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>My Listings</h1>
        <p style={styles.subtitle}>Manage your property listings</p>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div style={styles.loadingContainer}>Loading your listings...</div>
      ) : listings.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>You haven't created any listings yet.</p>
          <button
            style={styles.addButton}
            onClick={() => navigate("/add-listing")}
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              style={styles.addButton}
              onClick={() => navigate("/add-listing")}
            >
              + Add New Listing
            </button>
          </div>
          <div style={styles.listingsGrid}>
            {listings.map((listing) => {
              const images = listing.images ? JSON.parse(listing.images) : [];
              const firstImage = images.length > 0 ? images[0] : null;

              return (
                <div key={listing.id} style={styles.listingCard}>
                  {firstImage ? (
                    <img
                      src={`http://localhost:5001${firstImage}`}
                      alt={listing.title}
                      style={styles.listingImage}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      ...styles.noImage,
                      display: firstImage ? "none" : "flex",
                    }}
                  >
                    No Image Available
                  </div>

                  <h3 style={styles.listingTitle}>{listing.title}</h3>
                  <p style={styles.listingDetails}>
                    <strong>Type:</strong> {listing.property_type}
                  </p>
                  <p style={styles.listingDetails}>
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p style={styles.listingDetails}>
                    <strong>Purpose:</strong> {listing.purpose}
                  </p>
                  {listing.area && (
                    <p style={styles.listingDetails}>
                      <strong>Area:</strong> {listing.area}
                    </p>
                  )}
                  {listing.description && (
                    <p
                      style={{
                        ...styles.listingDetails,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>Description:</strong> {listing.description}
                    </p>
                  )}
                  <p style={styles.listingPrice}>
                    Rs. {parseInt(listing.price).toLocaleString()}
                    {listing.purpose === "rent" ? "/month" : ""}
                  </p>
                  <div style={styles.listingActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;
