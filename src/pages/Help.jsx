import React, { useState } from 'react';
import '../styles/global.css';

const Help = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="help-container">
      <header className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions or get in touch with our support team</p>
      </header>

      <section className="help-section">
        <h2>Frequently Asked Questions</h2>
        <p>Find quick answers to the most common questions about our platform.</p>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <p>Go to the login page, click "Forgot Password," and follow the instructions to reset your password.</p>
          </div>
          <div className="faq-item">
            <h3>How can I contact support?</h3>
            <p>Use the form below or email us at support@gharbazaar.com for immediate assistance.</p>
          </div>
          <div className="faq-item">
            <h3>Where can I find my account details?</h3>
            <p>Log in and navigate to the "Account" section in your profile settings to view and update your information.</p>
          </div>
          <div className="faq-item">
            <h3>How do I list a property?</h3>
            <p>After logging in, click on "Add Listing" and fill out the property details form with all required information.</p>
          </div>
        </div>
      </section>

      <section className="help-section">
        <h2>Contact Support</h2>
        <p>Fill out the form below, and our support team will get back to you within 24 hours.</p>
        <form className="help-contact-form" onSubmit={handleSubmit}>
          <div className="help-form-row">
            <div className="help-form-group">
              <label className="help-form-label" htmlFor="help-name">Your Name</label>
              <input
                type="text"
                id="help-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="help-form-input"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="help-form-group">
              <label className="help-form-label" htmlFor="help-email">Your Email</label>
              <input
                type="email"
                id="help-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="help-form-input"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="help-form-row help-form-row-single">
            <div className="help-form-group">
              <label className="help-form-label" htmlFor="help-message">Your Message</label>
              <textarea
                id="help-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="help-form-textarea"
                placeholder="Describe your issue or question in detail"
                required
              ></textarea>
            </div>
          </div>
          <button type="submit" className="help-form-button">
            Send Message
          </button>
        </form>
      </section>

      <section className="help-section">
        <h2>Additional Resources</h2>
        <p>Explore more resources to help you get the most out of our platform.</p>
        <ul className="support-links-list">
          <li className="support-links-item">
            <a href="/docs">User Documentation</a>
          </li>
          <li className="support-links-item">
            <a href="/community">Community Forum</a>
          </li>
          <li className="support-links-item">
            <a href="/status">System Status</a>
          </li>
          <li className="support-links-item">
            <a href="/tutorials">Video Tutorials</a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Help;