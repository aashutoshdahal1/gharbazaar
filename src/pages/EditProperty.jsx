import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./AddProperty.css";
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

// Map component for location selection
function LocationSelector({ position, setPosition }) {
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  }

  return (
    <MapContainer
      center={position || [27.7172, 85.324]} // Kathmandu, Nepal
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    purpose: "rent",
    price: "",
    address: "",
    area: "",
    phoneNumber: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${url}api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const property = data.data;
          setFormData({
            title: property.title || "",
            description: property.description || "",
            propertyType: property.property_type || "",
            purpose: property.purpose || "rent",
            price: property.price || "",
            address: property.location || "",
            area: property.area || "",
            phoneNumber: property.phone_number || "",
          });

          // Set existing images and cover index
          if (property.images) {
            const imageData = JSON.parse(property.images);
            if (imageData.length > 0 && typeof imageData[0] === "object") {
              // New format with cover image info
              const imageUrls = imageData.map((img) => img.url);
              const coverIndex = imageData.findIndex((img) => img.isCover);
              setExistingImages(imageUrls);
              setCoverImageIndex(coverIndex >= 0 ? coverIndex : 0);
            } else {
              // Old format - just array of strings
              setExistingImages(imageData);
              setCoverImageIndex(0);
            }
          }

          // Set position if coordinates exist
          if (property.latitude && property.longitude) {
            setPosition({
              lat: parseFloat(property.latitude),
              lng: parseFloat(property.longitude),
            });
          } else {
            setPosition({ lat: 27.7172, lng: 85.324 });
          }
        } else {
          setError("Failed to fetch property details");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("An error occurred while fetching property details");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length + existingImages.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB");
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        validPreviews.push({
          file,
          url: e.target.result,
        });

        if (validPreviews.length === validFiles.length) {
          setImages((prev) => [...prev, ...validFiles]);
          setImagePreviews((prev) => [...prev, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    // If removing the cover image, reset cover index
    if (index === coverImageIndex) {
      setCoverImageIndex(0);
    } else if (index < coverImageIndex) {
      setCoverImageIndex(coverImageIndex - 1);
    }
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setCoverImage = (index) => {
    setCoverImageIndex(index);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Append location data
      if (position) {
        submitData.append("latitude", position.lat);
        submitData.append("longitude", position.lng);
      }

      // Append existing images with cover image info
      const imagesWithCover = existingImages.map((img, index) => ({
        url: img,
        isCover: index === coverImageIndex,
      }));
      submitData.append("existingImages", JSON.stringify(imagesWithCover));
      submitData.append("coverImageIndex", coverImageIndex);

      // Append new images
      images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await fetch(`${url}api/properties/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Property updated successfully!");
        setTimeout(() => {
          navigate("/my-listings");
        }, 2000);
      } else {
        setError(data.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      setError("An error occurred while updating the listing");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="add-property-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-property-container">
      <div className="add-property-header">
        <h1>Edit Your Property</h1>
        <p>Update your property details and manage your listing</p>
      </div>

      <form onSubmit={handleSubmit} className="add-property-form">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Property Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Beautiful 2BHK Apartment in Kathmandu"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property in detail..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Property Type</option>
                <option value="house">House</option>
                <option value="flat">Flat/Apartment</option>
                <option value="room">Room</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose *</label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
              >
                <option value="rent">For Rent</option>
                <option value="sell">For Sale</option>
                <option value="buy">Want to Buy</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (NPR) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 25000"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Area (sq ft)</label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g., 1200 sq ft"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Contact Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., 9841234567 or +977-9841234567"
                required
                pattern="[0-9+\-\s]+"
                title="Please enter a valid phone number"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="form-section">
          <h2>Location</h2>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g., Thamel, Kathmandu"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Location on Map</label>
            <p className="form-help">
              Click on the map to set the exact location
            </p>
            <div className="map-wrapper">
              {position && (
                <LocationSelector
                  position={position}
                  setPosition={setPosition}
                />
              )}
            </div>
            {position && (
              <p className="coordinates">
                Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2>Property Images</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="form-group">
              <label>Current Images</label>
              <p className="form-help">
                Click "Set as Cover" to choose the main image for your listing
              </p>
              <div className="image-previews">
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="image-preview">
                    <img
                      src={`${url.replace(/\/$/, "")}${imageUrl}`}
                      alt={`Existing ${index + 1}`}
                      onError={(e) => {
                        console.log("Image failed to load:", e.target.src);
                        e.target.style.display = "none";
                      }}
                    />
                    {coverImageIndex === index && (
                      <div className="cover-badge">Cover Image</div>
                    )}
                    <div className="image-actions">
                      {coverImageIndex !== index && (
                        <button
                          type="button"
                          className="set-cover-btn"
                          onClick={() => setCoverImage(index)}
                        >
                          Set as Cover
                        </button>
                      )}
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeExistingImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Upload */}
          <div className="form-group">
            <label>Add More Images (Max 10 images total, 5MB each)</label>
            <div
              className="image-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-placeholder">
                <i className="upload-icon">📁</i>
                <p>Click to upload additional images</p>
                <p className="upload-info">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="form-group">
              <label>New Images to Add</label>
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="image-preview">
                    <img src={preview.url} alt={`New Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeNewImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/my-listings")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
