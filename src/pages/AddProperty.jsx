import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddProperty() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    purpose: "rent",
    price: "",
    address: "",
    area: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Kathmandu if geolocation fails
          setPosition({ lat: 27.7172, lng: 85.324 });
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 10) {
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

  const removeImage = (index) => {
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

      // Append images
      images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await fetch(`${url}api/properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Property listed successfully!");
        setTimeout(() => {
          navigate("/my-listings");
        }, 2000);
      } else {
        setError(data.message || "Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      setError("An error occurred while creating the listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-container">
      <div className="add-property-header">
        <h1>List Your Property</h1>
        <p>
          Share your property with thousands of potential buyers and renters
        </p>
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

          <div className="form-group">
            <label>Upload Images (Max 10 images, 5MB each)</label>
            <div
              className="image-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-placeholder">
                <i className="upload-icon">📁</i>
                <p>Click to upload images or drag and drop</p>
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

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview.url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Publishing..." : "Publish Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
