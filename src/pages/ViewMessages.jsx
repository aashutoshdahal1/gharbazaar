import React, { useState } from "react";

const ViewMessages = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const messages = [
    {
      id: 1,
      sender: "Liam Carter",
      subject: "Inquiry about 2BR apartment",
      date: "2023-09-15",
      isRead: false,
      listingId: "apt-2br-downtown-001",
    },
    {
      id: 2,
      sender: "Sophia Bennett",
      subject: "Question about lease terms",
      date: "2023-09-14",
      isRead: true,
      listingId: "apt-studio-midtown-002",
    },
    {
      id: 3,
      sender: "Noah Thompson",
      subject: "Interest in studio rental",
      date: "2023-09-13",
      isRead: true,
      listingId: "studio-loft-central-003",
    },
    {
      id: 4,
      sender: "Ava Rodriguez",
      subject: "Request for property viewing",
      date: "2023-09-12",
      isRead: false,
      listingId: "house-3br-suburbs-004",
    },
    {
      id: 5,
      sender: "Ethan Walker",
      subject: "Application for 1BR unit",
      date: "2023-09-11",
      isRead: true,
      listingId: "apt-1br-downtown-005",
    },
    {
      id: 6,
      sender: "Isabella Green",
      subject: "Follow-up on previous inquiry",
      date: "2023-09-10",
      isRead: true,
      listingId: "condo-2br-waterfront-006",
    },
    {
      id: 7,
      sender: "Jackson Hall",
      subject: "Confirmation of viewing schedule",
      date: "2023-09-09",
      isRead: false,
      listingId: "townhouse-3br-uptown-007",
    },
    {
      id: 8,
      sender: "Mia Wright",
      subject: "Clarification on pet policy",
      date: "2023-09-08",
      isRead: true,
      listingId: "apt-2br-petfriendly-008",
    },
    {
      id: 9,
      sender: "Aiden Clark",
      subject: "Offer for property rental",
      date: "2023-09-07",
      isRead: false,
      listingId: "penthouse-luxury-downtown-009",
    },
    {
      id: 10,
      sender: "Chloe Lewis",
      subject: "Feedback on property listing",
      date: "2023-09-06",
      isRead: true,
      listingId: "apt-studio-affordable-010",
    },
  ];

  const filteredMessages = messages.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewListing = (listingId) => {
    console.log(`Navigating to listing: ${listingId}`);
    // Replace with your actual route
    // navigate(`/listing/${listingId}`);
  };

  return (
    <div className="message-container">
      <div className="container-max-width">
        {/* Header */}
        <div className="message-header">
          <h1 className="card-title">Inbox</h1>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* All Messages Text */}
        <div className="all-messages-label">All Messages</div>

        {/* Messages Table */}
        <div className="table-container">
          <div className="table-header">
            <div className="header-cell">Sender</div>
            <div className="header-cell">Subject</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Action</div>
          </div>

          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${!message.isRead ? "unread-row" : ""}`}
            >
              <div className="sender-cell">
                <div className="avatar">
                  <span>👤</span>
                </div>
                <span
                  className={`sender-name ${
                    !message.isRead ? "bold-text" : ""
                  }`}
                >
                  {message.sender}
                </span>
              </div>

              <div className="sender-cell">
                <span>✉️</span>
                <span
                  className={`sender-name ${
                    !message.isRead ? "bold-text" : ""
                  }`}
                >
                  {message.subject}
                </span>
              </div>

              <div className="message-date">
                <span>📅</span>
                <span>{formatDate(message.date)}</span>
              </div>

              <div>
                <button
                  onClick={() => handleViewListing(message.listingId)}
                  className="action-button"
                >
                  <span>View Listing</span>
                  <span>🔗</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Count */}
        <div className="text-secondary mt-3">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;
