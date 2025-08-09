import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import HomePage from "./pages/HomePage";
import GharBazaarAuth from "./pages/Login_Signup";
import FilterPage from "./pages/FilterPage";
import PropertyDetail from "./pages/PropertyDetail";
import UserDashboard from "./pages/UserDashboard";
import MyListings from "./pages/MyListings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import EditProfile from "./pages/EditProfile";
import ViewMessages from "./pages/ViewMessages";
import Admin from "./pages/admin"; // Admin login page
import AdminDashboard from "./pages/adminDashboard"; // Admin dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GharBazaarAuth />} />
        <Route path="/login-signup" element={<GharBazaarAuth />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
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
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-listing"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ViewMessages />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
