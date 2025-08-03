import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="page-container">
      <button className="nav-back" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="card-header">
        <h1 className="card-title">Profile</h1>
        <p className="card-subtitle">Manage your account information</p>
      </div>

      <div className="card">
        <div className="form-row form-row-single">
          <div className="form-group">
            <span className="form-label">Name</span>
            <span className="text-primary font-weight-600">
              {user.name || "N/A"}
            </span>
          </div>
        </div>
        <div className="form-row form-row-single">
          <div className="form-group">
            <span className="form-label">Email</span>
            <span className="text-primary font-weight-600">
              {user.email || "N/A"}
            </span>
          </div>
        </div>
        <div className="form-row form-row-single">
          <div className="form-group">
            <span className="form-label">Account Type</span>
            <span className="text-primary font-weight-600">
              {user.role || "user"}
            </span>
          </div>
        </div>
        <div className="form-row form-row-single">
          <div className="form-group">
            <span className="form-label">Member Since</span>
            <span className="text-primary font-weight-600">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
