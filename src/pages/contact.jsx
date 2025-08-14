import React from "react";

const Contact = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any inquiries, support, or collaboration opportunities</p>
      </header>

      <section className="card">
        <h2 className="card-title">Our Contact Information</h2>
        <p className="card-subtitle">
          Reach out to us via the details below or connect with individual team members.
        </p>
        <div className="grid grid-2 mt-4">
          <div>
            <h3 className="font-weight-600 mb-2">General Inquiries</h3>
            <p>Email: info@gharbazaar.com</p>
            <p>Phone: +977-1-1234567</p>
          </div>
          <div>
            <h3 className="font-weight-600 mb-2">Address</h3>
            <p>GharBazaar Headquarters</p>
            <p>Kathmandu, Nepal</p>
            <p>Postal Code: 44600</p>
          </div>
        </div>
      </section>

      <section className="card mt-4">
        <h2 className="card-title">Our Team</h2>
        <p className="card-subtitle">
          Connect directly with our developers for technical questions or feedback.
        </p>
        <div className="grid grid-3 mt-4">
          <div className="team-member">
            <h3 className="team-member-name">Aashutosh Dahal</h3>
            <p className="team-member-role">Developer</p>
            <p>Email: aashutosh@gmail.com</p>
            <p>Phone: 9866666666</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Arush Pradhan</h3>
            <p className="team-member-role">Developer</p>
            <p>Email: arush@gmail.com</p>
            <p>Phone: 9867777777</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Amit Saini</h3>
            <p className="team-member-role">Developer</p>
            <p>Email: amit@gmail.com</p>
            <p>Phone: 9868888888</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Gurash Subedi</h3>
            <p className="team-member-role">Developer</p>
            <p>Email: gurash@gmail.com</p>
            <p>Phone: 9869999999</p>
          </div>
          <div className="team-member">
            <h3 className="team-member-name">Lukesh Raj Jyoti</h3>
            <p className="team-member-role">Developer</p>
            <p>Email: lukesh@gmail.com</p>
            <p>Phone: 9865555555</p>
          </div>
        </div>
      </section>

      <section className="card mt-4">
        <h2 className="card-title">Send Us a Message</h2>
        <p className="card-subtitle">
          Fill out the form below, and we'll get back to you as soon as possible.
        </p>
        <form className="form mt-4">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Name</label>
              <input type="text" id="name" className="form-input" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Your Email</label>
              <input type="email" id="email" className="form-input" placeholder="Enter your email" />
            </div>
          </div>
          <div className="form-group mt-3">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input type="text" id="subject" className="form-input" placeholder="Enter subject" />
          </div>
          <div className="form-group mt-3">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea id="message" className="form-textarea" placeholder="Enter your message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-4">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;