import React from "react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="nav-back" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="card-header">
        <h1 className="card-title">Favorite Properties</h1>
        <p className="card-subtitle">Properties you've saved for later</p>
      </div>

      <div className="card text-center">
        <p className="text-secondary mb-3">
          You haven't saved any favorites yet.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/properties")}
        >
          Browse Properties
        </button>
      </div>
    </div>
  );
};

export default Favorites;
