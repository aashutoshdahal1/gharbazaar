import React from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const About = () => {
  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const teamMembers = [
    { name: "Aashutosh Dahal", role: "Full Stack Developer" },
    { name: "Arush Pradhan", role: "Frontend Developer" },
    { name: "Amit Saini", role: "Frontend Developer" },
    { name: "Gurash Subedi", role: "Researcher" },
    { name: "Lukesh Raj Jyoti", role: "Team Leader" },
  ];

  const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "Express.js", icon: "🚀" },
    { name: "MySQL", icon: "🗃️" },
    { name: "Node.js", icon: "💚" },
  ];

  return (
    <div>
      <Navbar /> {/* ✅ Add Navbar here */}
      <div className="page-container">
        <header className="page-header">
          <h1>About Us</h1>
          <p>Learn more about the team behind GharBazaar and our mission</p>
        </header>

        <section className="card about-story-section">
          <h2 className="card-title">Our Story</h2>
          <p className="card-subtitle">
            GharBazaar is a revolutionary platform designed to simplify the
            process of buying and selling houses and land in Nepal. Created by a
            dedicated team of five passionate developers, we aim to bridge the
            gap between property seekers and sellers by providing a seamless,
            user-friendly experience. Our platform eliminates the traditional
            barriers in real estate transactions, making it easier than ever to
            find your dream property or sell your assets with confidence and
            ease.
          </p>
        </section>

        <section className="card about-team-section mt-4">
          <h2 className="card-title">Meet Our Team</h2>
          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="about-team-member">
                <div className="about-team-member-avatar">
                  {getInitials(member.name)}
                </div>
                <h3 className="about-team-member-name">{member.name}</h3>
                <p className="about-team-member-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card about-tech-section mt-4">
          <h2 className="card-title">Technology Stack</h2>
          <p className="card-subtitle">
            We built GharBazaar using cutting-edge technologies to ensure a
            robust, scalable, and efficient platform that delivers exceptional
            performance and user experience.
          </p>
          <div className="tech-stack-list">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-item-icon">{tech.icon}</div>
                <p className="tech-item-name">{tech.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card about-mission-section mt-4">
          <h2 className="card-title">Our Mission</h2>
          <p
            className="card-subtitle"
            style={{ color: "white", fontSize: "16px" }}
          >
            Our mission is to simplify the real estate process in Nepal by
            providing a user-friendly platform that connects buyers and sellers,
            ensuring a seamless and efficient experience for all.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
