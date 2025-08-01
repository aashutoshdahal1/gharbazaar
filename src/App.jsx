import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GharBazaarAuth from "./pages/Login_Signup";
import FilterPage from "./pages/FilterPage";
import UserDashboard from "./pages/UserDashboard";
import MyListings from "./pages/MyListings";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import AddListing from "./pages/AddListing";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GharBazaarAuth />} />
        <Route path="/login-signup" element={<GharBazaarAuth />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-listing"
          element={
            <ProtectedRoute>
              <AddListing />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
