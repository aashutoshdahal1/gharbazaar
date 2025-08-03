import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = url + "api";

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

  return (
    <div className="page-container">
      <button className="nav-back" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="card-header">
        <h1 className="card-title">My Listings</h1>
        <p className="card-subtitle">Manage your property listings</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">Loading your listings...</div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">You haven't created any listings yet.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-listing")}
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <>
          <div className="text-right mb-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-listing")}
            >
              + Add New Listing
            </button>
          </div>
          <div className="listings-grid">
            {listings.map((listing) => {
              let images = [];
              try {
                images = listing.images ? JSON.parse(listing.images) : [];
              } catch (error) {
                console.error("Error parsing images JSON:", error);
                images = [];
              }
              const firstImage = images.length > 0 ? images[0] : null;

              return (
                <div key={listing.id} className="listing-card">
                  {firstImage ? (
                    <img
                      src={`${url.replace(/\/$/, "")}${firstImage}`}
                      alt={listing.title}
                      className="listing-image"
                      onError={(e) => {
                        console.log("Image failed to load:", e.target.src);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="listing-no-image"
                    style={{
                      display: firstImage ? "none" : "flex",
                    }}
                  >
                    No Image Available
                  </div>

                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-details">
                    <strong>Type:</strong> {listing.property_type}
                  </p>
                  <p className="listing-details">
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p className="listing-details">
                    <strong>Purpose:</strong> {listing.purpose}
                  </p>
                  {listing.area && (
                    <p className="listing-details">
                      <strong>Area:</strong> {listing.area}
                    </p>
                  )}
                  {listing.description && (
                    <p className="listing-details text-ellipsis">
                      <strong>Description:</strong> {listing.description}
                    </p>
                  )}
                  <p className="listing-price">
                    Rs. {parseInt(listing.price).toLocaleString()}
                    {listing.purpose === "rent" ? "/month" : ""}
                  </p>
                  <div className="listing-actions">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
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
