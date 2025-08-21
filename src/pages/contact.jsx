import React, { useState } from "react";
import Navbar from "../components/Navbar";
import url from "../apiurl";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setSubmitMessage("Please fill in all fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // Submit to backend (use correct API base URL)
      const response = await fetch(`${url}api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage(
          "Thank you for your message! We'll get back to you soon."
        );
        setMessageType("success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitMessage("Failed to send message. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("Failed to send message. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setSubmitMessage("");
      setMessageType("");
    }, 5000);
  };

  const teamMembers = [
    {
      name: "Aashutosh Dahal",
      role: "Developer",
      email: "aashutosh@gmail.com",
      phone: "9866666666",
    },
    {
      name: "Arush Pradhan",
      role: "Developer",
      email: "arush@gmail.com",
      phone: "9867777777",
    },
    {
      name: "Amit Saini",
      role: "Developer",
      email: "amit@gmail.com",
      phone: "9868888888",
    },
    {
      name: "Gurash Subedi",
      role: "Developer",
      email: "gurash@gmail.com",
      phone: "9869999999",
    },
    {
      name: "Lukesh Raj Jyoti",
      role: "Developer",
      email: "lukesh@gmail.com",
      phone: "9865555555",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <header className="page-header">
          <h1>Contact Us</h1>
          <p>
            Get in touch with our team for any inquiries, support, or
            collaboration opportunities
          </p>
        </header>

        <section className="card contact-info-section">
          <h2 className="card-title">Our Contact Information</h2>
          <p className="card-subtitle">
            Reach out to us via the details below or connect with individual
            team members.
          </p>
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <h3 className="font-weight-600 mb-2">General Inquiries</h3>
              <p>Email: info@gharbazaar.com</p>
              <p>Phone: +977-1-1234567</p>
            </div>
            <div className="contact-info-item">
              <h3 className="font-weight-600 mb-2">Address</h3>
              <p>GharBazaar Headquarters</p>
              <p>Kathmandu, Nepal</p>
              <p>Postal Code: 44600</p>
            </div>
          </div>
        </section>

        <section className="card contact-team-section mt-4">
          <h2 className="card-title">Our Team</h2>
          <p className="card-subtitle">
            Connect directly with our developers for technical questions or
            feedback.
          </p>
          <div className="contact-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="contact-team-member">
                <div className="contact-team-member-avatar">
                  {getInitials(member.name)}
                </div>
                <h3 className="contact-team-member-name">{member.name}</h3>
                <p className="contact-team-member-role">{member.role}</p>
                <div className="contact-team-member-details">
                  <p>Email: {member.email}</p>
                  <p>Phone: {member.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card contact-form-section mt-4">
          <h2 className="card-title">Send Us a Message</h2>
          <p className="card-subtitle">
            Fill out the form below, and we'll get back to you as soon as
            possible.
          </p>

          {submitMessage && (
            <div className={`contact-message contact-message-${messageType}`}>
              {submitMessage}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="email">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="contact-form-row contact-form-row-single">
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Enter subject"
                  required
                />
              </div>
            </div>
            <div className="contact-form-row contact-form-row-single">
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-form-textarea"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="contact-form-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
