import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple admin credentials check
      if (credentials.email === 'admin@gharbazaar.com' && credentials.password === 'admin123') {
        localStorage.setItem('adminToken', 'authenticated');
        navigate('/admin-dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form">
        <div className="card-header">
          <h1 className="card-title">Admin Login</h1>
          <p className="card-subtitle">Access the administrative dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Signing In...
                </>
              ) : (
                'Login to Admin Dashboard'
              )}
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'var(--bg-light)', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
            Default Admin Credentials:
          </p>
          <p style={{ fontSize: 'var(--text-sm)', margin: '5px 0' }}>
            <strong>Email:</strong> admin@gharbazaar.com
          </p>
          <p style={{ fontSize: 'var(--text-sm)', margin: '5px 0' }}>
            <strong>Password:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;