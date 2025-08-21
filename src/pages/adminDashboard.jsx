import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import url from "../apiurl";
import { useLogo } from "../utils/logoManager.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logo, updateLogo } = useLogo();
  const [activeSection, setActiveSection] = useState("overview");
  const [currentLogo, setCurrentLogo] = useState("🏠"); // Default logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalListings: 0,
    totalUsers: 0,
    recentListings: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New state for user and listing management
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [userLoading, setUserLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  
  // Current admin user state
  const [currentAdmin, setCurrentAdmin] = useState(null);
  
  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Contact submissions state
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);

  const API_BASE_URL = url + "api";

  useEffect(() => {
    const styleId = 'admin-dashboard-styles';
    
    // Remove existing styles if they exist
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch dashboard stats from dedicated admin endpoint
      const dashboardResponse = await fetch(
        `${API_BASE_URL}/admin/dashboard-stats`
      );

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();

        if (dashboardData.success) {
          setDashboardData({
            totalListings: dashboardData.data.totalListings,
            totalUsers: dashboardData.data.totalUsers,
            recentListings: dashboardData.data.recentListings,
            recentUsers: dashboardData.data.recentUsers,
          });
        } else {
          setError("Failed to fetch dashboard data");
        }
      } else {
        // Fallback to individual endpoints if dashboard-stats is not available
        const propertiesResponse = await fetch(`${API_BASE_URL}/properties`);
        const propertiesData = await propertiesResponse.json();

        let totalUsers = Math.floor(Math.random() * 200) + 50; // Mock data

        if (propertiesData.success) {
          setDashboardData({
            totalListings: propertiesData.data.length,
            totalUsers: totalUsers,
            recentListings: propertiesData.data.slice(0, 5),
            recentUsers: [],
          });
        } else {
          setError("Failed to fetch dashboard data");
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch all users for admin management
  const fetchUsers = useCallback(async () => {
    try {
      setUserLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
          // Set current admin user if they are in the list
          const adminToken = localStorage.getItem('adminToken');
          if (adminToken) {
            const currentUser = data.data.find(user => user.token === adminToken);
            if (currentUser) {
              setCurrentAdmin(currentUser);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch all listings for admin management
  const fetchListings = useCallback(async () => {
    try {
      setListingLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/properties`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setListings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setListingLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch all contact submissions for admin management
  const fetchContactSubmissions = useCallback(async () => {
    try {
      setContactLoading(true);
      const response = await fetch(`${API_BASE_URL}/contact/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContactSubmissions(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setContactLoading(false);
    }
  }, [API_BASE_URL]);

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('User created successfully!');
          setShowAddUserForm(false);
          setNewUser({ name: '', email: '', password: '', role: 'user' });
          fetchUsers(); // Refresh user list
          fetchDashboardData(); // Refresh dashboard stats
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their listings.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('User deleted successfully!');
          fetchUsers(); // Refresh user list
          fetchDashboardData(); // Refresh dashboard stats
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Delete listing
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/properties/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Listing deleted successfully!');
          fetchListings(); // Refresh listing list
          fetchDashboardData(); // Refresh dashboard stats
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId, newRole) => {
    // Prevent changing own role
    if (userId === currentAdmin?.id) {
      alert('You cannot change your own role.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('User role updated successfully!');
          fetchUsers(); // Refresh user list
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  // Update contact submission status
  const handleUpdateContactStatus = async (submissionId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submissions/${submissionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Status updated successfully!');
          fetchContactSubmissions(); // Refresh contact submissions
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update status');
    }
  };

  // Delete contact submission
  const handleDeleteContactSubmission = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact/submissions/${submissionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Contact submission deleted successfully!');
          fetchContactSubmissions(); // Refresh contact submissions
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete contact submission');
      }
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      alert('Failed to delete contact submission');
    }
  };

  // Change admin password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Password changed successfully!');
          setShowChangePassword(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin");
      return;
    }

    // Load current admin user info
    const adminUserStr = localStorage.getItem("adminUser");
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        setCurrentAdmin(adminUser);
      } catch (error) {
        console.error("Error parsing admin user data:", error);
      }
    }

    // Fetch dashboard data
    fetchDashboardData();
    // Fetch users and listings for management
    fetchUsers();
    fetchListings();
    // Fetch contact submissions for management
    fetchContactSubmissions();
  }, [navigate, fetchDashboardData, fetchUsers, fetchListings, fetchContactSubmissions]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const handleTotalListingsClick = () => {
    console.log("Navigate to total listings page");
  };

  const handleTotalUsersClick = () => {
    console.log("Navigate to total users page");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, GIF, and SVG files are allowed");
        return;
      }

      setLogoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (logoFile) {
      try {
        // Here you would upload to your backend
        console.log("Uploading logo:", logoFile);

        // Update the global logo state using the logo manager
        updateLogo(logoPreview);
        console.log("Logo updated globally:", logoPreview);

        // For now, just update the preview as the current logo
        setCurrentLogo(logoPreview);

        alert("Logo updated successfully!");
        setLogoFile(null);
        setLogoPreview(null);
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Failed to upload logo. Please try again.");
      }
    }
  };

  // Load saved logo on component mount
  useEffect(() => {
    if (logo.useImage && logo.image) {
      setCurrentLogo(logo.image);
    } else {
      setCurrentLogo(logo.text || "🏠");
    }
  }, [logo]);

  const handleCancelLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="admin-dashboard-section">
            <h2 className="card-title">Dashboard Overview</h2>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-4 gap-5 mb-5">
              {/* Total Listings Card */}
              <div
                onClick={handleTotalListingsClick}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">🏠</div>
                <h2 className="dashboard-card-title">
                  {loading ? "..." : dashboardData.totalListings}
                </h2>
                <p className="dashboard-card-subtitle">
                  Total Listings
                </p>
              </div>

              {/* Total Users Card */}
              <div
                onClick={handleTotalUsersClick}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">👥</div>
                <h2 className="dashboard-card-title">
                  {loading ? "..." : dashboardData.totalUsers}
                </h2>
                <p className="dashboard-card-subtitle">
                  Total Users
                </p>
              </div>

              {/* Contact Submissions Card */}
              <div
                onClick={() => setActiveSection("contacts")}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">📧</div>
                <h2 className="dashboard-card-title">
                  {contactLoading ? "..." : contactSubmissions.length}
                </h2>
                <p className="dashboard-card-subtitle">
                  Contact Submissions
                </p>
              </div>

              {/* New Contact Submissions Card */}
              <div
                onClick={() => setActiveSection("contacts")}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">🆕</div>
                <h2 className="dashboard-card-title">
                  {loading ? "..." : contactSubmissions.filter(s => s.status === 'new').length}
                </h2>
                <p className="dashboard-card-subtitle">
                  New Messages
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-2 gap-5">
              {/* Recent Listings */}
              <div className="card">
                <h3 className="card-title">Recent Listings</h3>
                {dashboardData.recentListings.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {dashboardData.recentListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="dashboard-recent-listing"
                      >
                        <h4>{listing.title}</h4>
                        <p>
                          {listing.location} - Rs{" "}
                          {parseFloat(listing.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary">No listings available</p>
                )}
              </div>

              {/* System Info */}
              <div className="dashboard-quick-action">
                <h3 className="card-title">Quick Actions</h3>
                <div className="dashboard-quick-action-buttons">
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    {loading ? "Refreshing..." : "🔄 Refresh Data"}
                  </button>

                  <button
                    onClick={() => navigate("/filter")}
                    className="btn btn-primary"
                  >
                    🏠 View All Properties
                  </button>

                  <button
                    onClick={() => window.open("/", "_blank")}
                    className="btn btn-warning"
                  >
                    🌐 View Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "homepage":
        return (
          <div>
            <h2 className="card-title">Homepage Management</h2>

            {/* Logo Management Section */}
            <div className="dashboard-logo-section">
              <h3 className="card-title">Website Logo</h3>

              <div className="flex gap-5 mb-5">
                <div>
                  <label className="form-label">
                    Current Logo:
                  </label>
                  <div className="dashboard-logo-preview">
                    {typeof currentLogo === "string" &&
                    currentLogo.length <= 2 ? (
                      currentLogo
                    ) : (
                      <img
                        src={currentLogo}
                        alt="Current Logo"
                      />
                    )}
                  </div>
                </div>

                {logoPreview && (
                  <div>
                    <label className="form-label">
                      Preview:
                    </label>
                    <div className="dashboard-logo-preview" style={{ borderColor: '#3b82f6' }}>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="dashboard-logo-upload">
                <label htmlFor="logoUpload" className="form-label">
                  Upload New Logo:
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="form-input"
                />
                <p className="text-secondary">
                  Supported formats: JPG, PNG, SVG, GIF (Max size: 2MB)
                </p>
              </div>

              {logoFile && (
                <div className="dashboard-logo-actions">
                  <button
                    onClick={handleSaveLogo}
                    className="btn btn-primary"
                  >
                    Save Logo
                  </button>
                  <button
                    onClick={handleCancelLogo}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

          </div>
        );

      case "users":
        return (
          <div className="admin-dashboard-section">
            <div className="flex justify-between items-center mb-5">
              <h2 className="card-title">User Management</h2>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="btn btn-primary"
              >
                {showAddUserForm ? 'Cancel' : '➕ Add New User'}
              </button>
            </div>

            {/* Current Admin Info */}
            {currentAdmin && (
              <div className="card mb-5" style={{ backgroundColor: 'var(--bg-light)', border: '2px solid var(--primary-color)' }}>
                <h3 className="card-title">👑 Current Admin User</h3>
                <div className="flex gap-4 items-center">
                  <div>
                    <p><strong>Name:</strong> {currentAdmin.name}</p>
                    <p><strong>Email:</strong> {currentAdmin.email}</p>
                    <p><strong>Role:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{currentAdmin.role}</span></p>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <p>• You cannot change your own role</p>
                    <p>• You cannot delete your own account</p>
                  </div>
                </div>
              </div>
            )}

            {/* Add User Form */}
            {showAddUserForm && (
              <div className="card mb-5">
                <h3 className="card-title">Add New User</h3>
                <form onSubmit={handleAddUser} className="admin-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                      type="password"
                      id="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role:</label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="form-input"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="btn btn-success">
                    Create User
                  </button>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="card">
              <h3 className="card-title">All Users ({users.length})</h3>
              {userLoading ? (
                <p>Loading users...</p>
              ) : users.length > 0 ? (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className={user.id === currentAdmin?.id ? 'current-admin-row' : ''}>
                          <td>{user.id}</td>
                          <td>
                            {user.name}
                            {user.id === currentAdmin?.id && <span style={{ color: 'var(--primary-color)', marginLeft: '8px' }}>👑</span>}
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="form-select-small"
                              disabled={user.id === currentAdmin?.id}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            {user.id === currentAdmin?.id && (
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                                (Current)
                              </span>
                            )}
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-danger btn-small"
                              disabled={user.role === 'admin' || user.id === currentAdmin?.id}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary">No users found</p>
              )}
            </div>
          </div>
        );

      case "listings":
        return (
          <div className="admin-dashboard-section">
            <h2 className="card-title">Listing Management</h2>
            
            {/* Listings List */}
            <div className="card">
              <h3 className="card-title">All Listings ({listings.length})</h3>
              {listingLoading ? (
                <p>Loading listings...</p>
              ) : listings.length > 0 ? (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Type</th>
                        <th>Purpose</th>
                        <th>Price</th>
                        <th>Location</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing.id}>
                          <td>{listing.id}</td>
                          <td>{listing.title}</td>
                          <td>{listing.owner_name || 'Unknown'}</td>
                          <td>{listing.property_type}</td>
                          <td>{listing.purpose}</td>
                          <td>Rs {parseFloat(listing.price).toLocaleString()}</td>
                          <td>{listing.location}</td>
                          <td>{new Date(listing.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="btn btn-danger btn-small"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary">No listings found</p>
              )}
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="admin-dashboard-section">
            <h2 className="card-title">Contact Submissions Management</h2>
            
            {/* Contact Submissions List */}
            <div className="card">
              <h3 className="card-title">All Contact Submissions ({contactSubmissions.length})</h3>
              {contactLoading ? (
                <p>Loading contact submissions...</p>
              ) : contactSubmissions.length > 0 ? (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactSubmissions.map((submission) => (
                        <tr key={submission.id} className={`contact-submission-row status-${submission.status}`}>
                          <td>{submission.id}</td>
                          <td>{submission.name}</td>
                          <td>{submission.email}</td>
                          <td>{submission.subject}</td>
                          <td>
                            <div className="message-preview">
                              {submission.message.length > 50 
                                ? `${submission.message.substring(0, 50)}...` 
                                : submission.message
                              }
                            </div>
                          </td>
                          <td>
                            <select
                              value={submission.status}
                              onChange={(e) => handleUpdateContactStatus(submission.id, e.target.value)}
                              className={`form-select-small status-${submission.status}`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td>{new Date(submission.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteContactSubmission(submission.id)}
                              className="btn btn-danger btn-small"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary">No contact submissions found</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-dashboard-sidebar">
        {/* Admin Header */}
        <div className="admin-dashboard-sidebar-header">
          <h1>GharBazaar Admin</h1>
          <p>Administrative Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-dashboard-nav">
          <div
            onClick={() => setActiveSection("overview")}
            className={`admin-dashboard-nav-item ${activeSection === "overview" ? "active" : ""}`}
          >
            📊 Dashboard Overview
          </div>

          <div
            onClick={() => setActiveSection("homepage")}
            className={`admin-dashboard-nav-item ${activeSection === "homepage" ? "active" : ""}`}
          >
            🏠 Homepage Management
          </div>

          <div
            onClick={() => setActiveSection("users")}
            className={`admin-dashboard-nav-item ${activeSection === "users" ? "active" : ""}`}
          >
            👥 User Management
          </div>

          <div
            onClick={() => setActiveSection("listings")}
            className={`admin-dashboard-nav-item ${activeSection === "listings" ? "active" : ""}`}
          >
            🏘️ Listing Management
          </div>

          <div
            onClick={() => setActiveSection("contacts")}
            className={`admin-dashboard-nav-item ${activeSection === "contacts" ? "active" : ""}`}
          >
            📧 Contact Submissions
          </div>
        </nav>

        {/* Logout Button */}
        <div className="admin-dashboard-logout">
          <button
            onClick={handleLogout}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        {/* Welcome Header */}
        <div className="admin-dashboard-welcome">
          <h1>Welcome {currentAdmin?.name || 'Admin'}</h1>
          <p>Manage your GharBazaar platform from this dashboard</p>
        </div>

        {/* Dynamic Content */}
        <div className="admin-dashboard-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;