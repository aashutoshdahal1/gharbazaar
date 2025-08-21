import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import url from "../apiurl";
import Navbar from "../components/Navbar";
import SendMessage from "../components/SendMessage";

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
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const API_BASE_URL = url + "api";

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/favorites/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [API_BASE_URL, id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/listing/${id}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setAverageRating(parseFloat(data.data.averageRating));
        setTotalReviews(data.data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [API_BASE_URL, id]);

  const fetchUserReview = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/reviews/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        setUserReview(data.data);
        setRating(data.data.rating);
        setReviewText(data.data.review_text || "");
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  }, [API_BASE_URL, id]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties/${id}`);
        const data = await response.json();

        if (data.success) {
          setProperty(data.data);
          // Fetch additional data
          await Promise.all([
            checkFavoriteStatus(),
            fetchReviews(),
            fetchUserReview(),
          ]);
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
  }, [id, API_BASE_URL, checkFavoriteStatus, fetchReviews, fetchUserReview]);

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to save favorites");
        return;
      }

      const method = isFavorited ? "DELETE" : "POST";
      const url = isFavorited
        ? `${API_BASE_URL}/favorites/${id}`
        : `${API_BASE_URL}/favorites`;

      const body = isFavorited ? null : JSON.stringify({ listing_id: id });

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      if (data.success) {
        setIsFavorited(!isFavorited);
        alert(data.message);
      } else {
        alert(data.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("An error occurred while updating favorites");
    }
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to submit a review");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: id,
          rating,
          review_text: reviewText.trim() || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowReviewForm(false);
        // Refresh reviews
        await Promise.all([fetchReviews(), fetchUserReview()]);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting review");
    }
  };

  const handleSendMessage = (messageData) => {
    // Show success message and redirect to messages
    console.log("Message sent successfully:", messageData);

    // Show success notification
    alert("Message sent successfully! Redirecting to messages...");

    // Redirect to messages page with conversation parameters
    setTimeout(() => {
      navigate(`/messages?listing=${property.id}&user=${property.user_id}`);
    }, 1000);
  };

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
      <Navbar
        showDashboardButton={true}
        showBackButton={true}
        backButtonText="← Back to Properties"
        backButtonAction={() => navigate("/filter")}
      />

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
                onClick={() => setShowSendMessage(true)}
              >
                💬 Send Message
              </button>
              <button
                style={{
                  ...styles.contactButton,
                  backgroundColor: isFavorited ? "#ef4444" : "#f8fafc",
                  color: isFavorited ? "white" : "#374151",
                  border: isFavorited ? "none" : "1px solid #d1d5db",
                }}
                onClick={toggleFavorite}
              >
                {isFavorited
                  ? "❤️ Remove from Favorites"
                  : "🤍 Save to Favorites"}
              </button>

              {/* Reviews Section */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "20px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}
                  >
                    Reviews ({totalReviews})
                  </h3>
                  {totalReviews > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: "#fbbf24",
                              fontSize: "16px",
                            }}
                          >
                            {star <= averageRating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: "14px", color: "#6b7280" }}>
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {localStorage.getItem("token") && !userReview && (
                  <button
                    style={{
                      ...styles.contactButton,
                      backgroundColor: "#8b5cf6",
                      color: "white",
                      marginBottom: "16px",
                    }}
                    onClick={() => {
                      setRating(5); // Default to 5 stars for new reviews
                      setReviewText("");
                      setShowReviewForm(true);
                    }}
                  >
                    ⭐ Write a Review
                  </button>
                )}

                {userReview && (
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      border: "2px solid #10b981",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#10b981",
                        }}
                      >
                        Your Review
                      </span>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: "#fbbf24",
                              fontSize: "14px",
                            }}
                          >
                            {star <= userReview.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                    {userReview.review_text && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        {userReview.review_text}
                      </p>
                    )}
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "#8b5cf6",
                        border: "1px solid #8b5cf6",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                      onClick={() => {
                        setRating(userReview.rating); // Set to current rating
                        setReviewText(userReview.review_text || "");
                        setShowReviewForm(true);
                      }}
                    >
                      Edit Review
                    </button>
                  </div>
                )}

                {reviews.length > 0 ? (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        style={{
                          backgroundColor: "white",
                          padding: "12px",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>
                            {review.user_name}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div style={{ display: "flex", gap: "1px" }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    color: "#fbbf24",
                                    fontSize: "12px",
                                  }}
                                >
                                  {star <= review.rating ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            <span
                              style={{ fontSize: "12px", color: "#6b7280" }}
                            >
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {review.review_text && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#374151",
                              lineHeight: "1.4",
                            }}
                          >
                            {review.review_text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : totalReviews === 0 ? (
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    No reviews yet. Be the first to review this property!
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowReviewForm(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => {
              // Prevent modal from closing when clicking inside
              e.stopPropagation();
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "16px",
              }}
            >
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Rating
              </label>
              <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRating(star);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "28px",
                      cursor: "pointer",
                      color: "#fbbf24",
                      padding: "4px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                    title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    {star <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                <span>Click stars to rate (1-5)</span>
                <span
                  style={{
                    backgroundColor: rating > 0 ? "#10b981" : "#e5e7eb",
                    color: rating > 0 ? "white" : "#6b7280",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {rating > 0 ? `${rating}/5` : "No rating"}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this property..."
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowReviewForm(false);
                  if (!userReview) {
                    setRating(5);
                    setReviewText("");
                  }
                }}
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#374151",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Submitting review with rating: ${rating}`); // Debug log
                  submitReview();
                }}
                disabled={rating === 0}
                style={{
                  backgroundColor: rating > 0 ? "#8b5cf6" : "#d1d5db",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: rating > 0 ? "pointer" : "not-allowed",
                  opacity: rating > 0 ? 1 : 0.5,
                }}
              >
                {userReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showSendMessage && (
        <SendMessage
          property={property}
          onClose={() => setShowSendMessage(false)}
          onMessageSent={handleSendMessage}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
