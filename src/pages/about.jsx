import React from "react";

const About = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>About Us</h1>
        <p>Learn more about the team behind GharBazaar</p>
      </header>

      <section className="card">
        <h2 className="card-title">Our Story</h2>
        <p className="card-subtitle">
          GharBazaar is a platform designed to simplify the process of buying and selling houses and land. Created by a dedicated team of five, we aim to provide a seamless experience for users looking to find their dream property or sell their assets with ease.
        </p>
      </section>

      <section className="card mt-4">
        <h2 className="card-title">Our Team</h2>
        <div className="grid grid-3">
          <div className="team-member">
            <h3 className="team-member-name">Aashutosh Dahal</h3>
            <p className="team-member-role">Developer</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Arush Pradhan</h3>
            <p className="team-member-role">Developer</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Amit Saini</h3>
            <p className="team-member-role">Developer</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Gurash Subedi</h3>
            <p className="team-member-role">Developer</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Lukesh Raj Jyoti</h3>
            <p className="team-member-role">Developer</p>
          </div>
        </div>
      </section>

      <section className="card mt-4">
        <h2 className="card-title">Technology Stack</h2>
        <p className="card-subtitle">
          We built GharBazaar using React for the front end, Express.js for the backend, and MySQL as our database to ensure a robust and efficient platform.
        </p>
      </section>
    </div>
  );
};

export default About;