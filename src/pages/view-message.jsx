import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const messages = [
    {
      id: 1,
      sender: 'Liam Carter',
      subject: 'Inquiry about 2BR apartment',
      date: '2023-09-15',
      isRead: false,
      listingId: 'apt-2br-downtown-001'
    },
    {
      id: 2,
      sender: 'Sophia Bennett',
      subject: 'Question about lease terms',
      date: '2023-09-14',
      isRead: true,
      listingId: 'apt-studio-midtown-002'
    },
    {
      id: 3,
      sender: 'Noah Thompson',
      subject: 'Interest in studio rental',
      date: '2023-09-13',
      isRead: true,
      listingId: 'studio-loft-central-003'
    },
    {
      id: 4,
      sender: 'Ava Rodriguez',
      subject: 'Request for property viewing',
      date: '2023-09-12',
      isRead: false,
      listingId: 'house-3br-suburbs-004'
    },
    {
      id: 5,
      sender: 'Ethan Walker',
      subject: 'Application for 1BR unit',
      date: '2023-09-11',
      isRead: true,
      listingId: 'apt-1br-downtown-005'
    },
    {
      id: 6,
      sender: 'Isabella Green',
      subject: 'Follow-up on previous inquiry',
      date: '2023-09-10',
      isRead: true,
      listingId: 'condo-2br-waterfront-006'
    },
    {
      id: 7,
      sender: 'Jackson Hall',
      subject: 'Confirmation of viewing schedule',
      date: '2023-09-09',
      isRead: false,
      listingId: 'townhouse-3br-uptown-007'
    },
    {
      id: 8,
      sender: 'Mia Wright',
      subject: 'Clarification on pet policy',
      date: '2023-09-08',
      isRead: true,
      listingId: 'apt-2br-petfriendly-008'
    },
    {
      id: 9,
      sender: 'Aiden Clark',
      subject: 'Offer for property rental',
      date: '2023-09-07',
      isRead: false,
      listingId: 'penthouse-luxury-downtown-009'
    },
    {
      id: 10,
      sender: 'Chloe Lewis',
      subject: 'Feedback on property listing',
      date: '2023-09-06',
      isRead: true,
      listingId: 'apt-studio-affordable-010'
    }
  ];

  const filteredMessages = messages.filter(message => 
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
  };

  const handleViewListing = (listingId) => {
    console.log(`Navigating to listing: ${listingId}`);
    // Replace with your actual route
    // navigate(`/listing/${listingId}`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    searchContainer: {
      marginBottom: '24px',
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      fontSize: '16px'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '48px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s'
    },
    allMessages: {
      marginBottom: '24px',
      fontSize: '18px',
      fontWeight: '500',
      color: '#374151'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr 1fr',
      gap: '16px',
      padding: '16px 24px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    headerCell: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    messageRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr 1fr',
      gap: '16px',
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    unreadRow: {
      backgroundColor: '#eff6ff'
    },
    senderCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px'
    },
    senderName: {
      fontSize: '14px',
      color: '#374151'
    },
    boldText: {
      fontWeight: '600',
      color: '#111827'
    },
    subjectCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    unreadDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#3b82f6',
      borderRadius: '50%'
    },
    subjectText: {
      fontSize: '14px',
      color: '#4b5563'
    },
    dateCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    dateText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    actionCell: {
      display: 'flex',
      alignItems: 'center'
    },
    viewButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      outline: 'none'
    },
    messageCount: {
      marginTop: '16px',
      fontSize: '14px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Inbox</h1>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* All Messages Text */}
        <div style={styles.allMessages}>
          All Messages
        </div>

        {/* Messages Table */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.headerCell}>Sender</div>
            <div style={styles.headerCell}>Subject</div>
            <div style={styles.headerCell}>Date</div>
            <div style={styles.headerCell}>Action</div>
          </div>

          {filteredMessages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.messageRow,
                ...(message.isRead ? {} : styles.unreadRow)
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = message.isRead ? 'white' : '#eff6ff'}
            >
              <div style={styles.senderCell}>
                <div style={styles.avatar}>
                  <span>👤</span>
                </div>
                <span style={{
                  ...styles.senderName,
                  ...(message.isRead ? {} : styles.boldText)
                }}>
                  {message.sender}
                </span>
              </div>
              
              <div style={styles.subjectCell}>
                {!message.isRead && <div style={styles.unreadDot}></div>}
                <span>✉️</span>
                <span style={{
                  ...styles.subjectText,
                  ...(message.isRead ? {} : styles.boldText)
                }}>
                  {message.subject}
                </span>
              </div>
              
              <div style={styles.dateCell}>
                <span>📅</span>
                <span style={styles.dateText}>
                  {formatDate(message.date)}
                </span>
              </div>

              <div style={styles.actionCell}>
                <button
                  onClick={() => handleViewListing(message.listingId)}
                  style={styles.viewButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  <span>View Listing</span>
                  <span>🔗</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Count */}
        <div style={styles.messageCount}>
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;