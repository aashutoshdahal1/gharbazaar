import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [currentLogo, setCurrentLogo] = useState('🏠'); // Default logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleTotalListingsClick = () => {
    console.log('Navigate to total listings page');
  };

  const handleTotalUsersClick = () => {
    console.log('Navigate to total users page');
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    if (logoFile) {
      // Here you would upload to your backend
      console.log('Uploading logo:', logoFile);
      setCurrentLogo(logoPreview);
      alert('Logo updated successfully!');
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleCancelLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: '30px', color: 'var(--text-primary)' }}>
              Dashboard Overview
            </h2>
            
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* Total Listings Card */}
              <div 
                onClick={handleTotalListingsClick}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  border: '2px solid var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '60px', 
                    marginBottom: '20px',
                    color: 'var(--primary-color)'
                  }}>
                    🏠
                  </div>
                  <h2 style={{ 
                    fontSize: 'var(--text-5xl)', 
                    fontWeight: 'var(--font-bold)', 
                    color: 'var(--text-primary)',
                    margin: '0 0 10px 0'
                  }}>
                    45
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--text-xl)', 
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    Total Listings
                  </p>
                </div>
              </div>

              {/* Total Users Card */}
              <div 
                onClick={handleTotalUsersClick}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  border: '2px solid var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '60px', 
                    marginBottom: '20px',
                    color: 'var(--success-color)'
                  }}>
                    👥
                  </div>
                  <h2 style={{ 
                    fontSize: 'var(--text-5xl)', 
                    fontWeight: 'var(--font-bold)', 
                    color: 'var(--text-primary)',
                    margin: '0 0 10px 0'
                  }}>
                    128
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--text-xl)', 
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    Total Users
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'homepage':
        return (
          <div>
            <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: '30px', color: 'var(--text-primary)' }}>
              Homepage Management
            </h2>
            
            {/* Logo Management Section */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: '20px', color: 'var(--text-primary)' }}>
                Website Logo
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'var(--font-semibold)' }}>
                    Current Logo:
                  </label>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    border: '2px solid var(--border-light)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    backgroundColor: 'var(--bg-light)'
                  }}>
                    {typeof currentLogo === 'string' && currentLogo.length === 2 ? (
                      currentLogo
                    ) : (
                      <img 
                        src={currentLogo} 
                        alt="Current Logo" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                </div>
                
                {logoPreview && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'var(--font-semibold)' }}>
                      Preview:
                    </label>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      border: '2px solid var(--primary-color)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="logoUpload" className="form-label">
                  Upload New Logo:
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="form-input"
                  style={{ marginBottom: '10px' }}
                />
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                  Supported formats: JPG, PNG, SVG, GIF (Max size: 2MB)
                </p>
              </div>
              
              {logoFile && (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={handleSaveLogo} className="btn btn-primary">
                    Save Logo
                  </button>
                  <button onClick={handleCancelLogo} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'var(--bg-primary)',
        boxShadow: 'var(--shadow-md)',
        borderRight: '1px solid var(--border-light)'
      }}>
        {/* Admin Header */}
        <div style={{ 
          padding: '30px 20px',
          borderBottom: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: 'var(--text-2xl)', 
            color: 'var(--primary-color)', 
            margin: '0 0 10px 0',
            fontWeight: 'var(--font-bold)'
          }}>
            GharBazaar Admin
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-sm)', 
            margin: 0 
          }}>
            Administrative Panel
          </p>
        </div>
        
        {/* Navigation Menu */}
        <nav style={{ padding: '20px 0' }}>
          <div
            onClick={() => setActiveSection('overview')}
            style={{
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeSection === 'overview' ? 'var(--bg-light)' : 'transparent',
              borderLeft: activeSection === 'overview' ? '4px solid var(--primary-color)' : '4px solid transparent',
              color: activeSection === 'overview' ? 'var(--primary-color)' : 'var(--text-primary)',
              fontWeight: activeSection === 'overview' ? 'var(--font-semibold)' : 'var(--font-normal)',
              transition: 'all var(--transition-normal)'
            }}
          >
            📊 Dashboard Overview
          </div>
          
          <div
            onClick={() => setActiveSection('homepage')}
            style={{
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeSection === 'homepage' ? 'var(--bg-light)' : 'transparent',
              borderLeft: activeSection === 'homepage' ? '4px solid var(--primary-color)' : '4px solid transparent',
              color: activeSection === 'homepage' ? 'var(--primary-color)' : 'var(--text-primary)',
              fontWeight: activeSection === 'homepage' ? 'var(--font-semibold)' : 'var(--font-normal)',
              transition: 'all var(--transition-normal)'
            }}
          >
            🏠 Homepage Management
          </div>
        </nav>
        
        {/* Logout Button */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          right: '20px' 
        }}>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        padding: '40px',
        backgroundColor: 'var(--bg-secondary)',
        overflowY: 'auto'
      }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: 'var(--text-4xl)', 
            color: 'var(--text-primary)', 
            margin: '0 0 10px 0',
            fontWeight: 'var(--font-bold)'
          }}>
            Welcome Admin
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-lg)', 
            margin: 0 
          }}>
            Manage your GharBazaar platform from this dashboard
          </p>
        </div>
        
        {/* Dynamic Content */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;