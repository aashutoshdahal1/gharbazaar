import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import url from "../apiurl";

const ViewMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_BASE_URL = url + "api";

  // ✅ Get user ID from localStorage
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || null;
    } catch {
      return null;
    }
  };

  // ✅ Fetch Conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view messages");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setConversations(data.data);
      } else {
        setError(data.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("An error occurred while fetching conversations");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // ✅ Fetch Messages
  const fetchMessages = useCallback(
    async (listingId, otherUserId) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/messages/conversation/${listingId}/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setMessages(data.data);
        } else {
          console.error("Failed to fetch messages:", data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [API_BASE_URL]
  );

  // ✅ Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ✅ Fetch messages on conversation select
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(
        selectedConversation.listing_id,
        selectedConversation.other_user_id
      );
    }
  }, [selectedConversation, fetchMessages]);

  // ✅ Auto-select conversation if in URL
  useEffect(() => {
    const listingId = searchParams.get("listing");
    const userId = searchParams.get("user");

    if (
      listingId &&
      userId &&
      conversations.length > 0 &&
      !selectedConversation
    ) {
      const matchingConversation = conversations.find(
        (conv) =>
          conv.listing_id === parseInt(listingId) &&
          conv.other_user_id === parseInt(userId)
      );

      if (matchingConversation) {
        setSelectedConversation(matchingConversation);
      }
    }
  }, [conversations, searchParams, selectedConversation]);

  // ✅ Polling: refresh messages every 5 seconds
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(
        selectedConversation.listing_id,
        selectedConversation.other_user_id
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation, fetchMessages]);

  // ✅ Send message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission to stop page refresh

    if (!newMessage.trim() || !selectedConversation) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to send messages");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: selectedConversation.other_user_id,
          listing_id: selectedConversation.listing_id,
          message: newMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewMessage("");
        setMessages((prev) => [...prev, data.data]);

        // Update conversation's last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.listing_id === selectedConversation.listing_id &&
            conv.other_user_id === selectedConversation.other_user_id
              ? {
                  ...conv,
                  last_message: newMessage,
                  last_message_time: new Date().toISOString(),
                }
              : conv
          )
        );
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      alert("An error occurred while sending the message");
      console.error("Error sending message:", error);
    }
  };

  // ✅ Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    return diffInHours < 24
      ? date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar
          showDashboardButton={true}
          showBackButton={true}
          backButtonText="← Back to Dashboard"
          backButtonAction={() => navigate("/dashboard")}
        />
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>Loading conversations...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar
          showDashboardButton={true}
          showBackButton={true}
          backButtonText="← Back to Dashboard"
          backButtonAction={() => navigate("/dashboard")}
        />
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <div style={styles.errorText}>{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        showDashboardButton={true}
        showBackButton={true}
        backButtonText="← Back to Dashboard"
        backButtonAction={() => navigate("/dashboard")}
      />
      <div style={styles.container}>
        {/* Conversations Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Messages</h2>
          </div>

          <div style={styles.conversationsList}>
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <div style={styles.emptyText}>No conversations yet</div>
                <div style={styles.emptySubtext}>
                  Start messaging property owners to see conversations here
                </div>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={`${conversation.listing_id}-${conversation.other_user_id}`}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedConversation?.listing_id ===
                      conversation.listing_id &&
                    selectedConversation?.other_user_id ===
                      conversation.other_user_id
                      ? styles.selectedConversation
                      : {}),
                  }}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div style={styles.conversationAvatar}>
                    <span>👤</span>
                  </div>
                  <div style={styles.conversationContent}>
                    <div style={styles.conversationHeader}>
                      <div style={styles.conversationName}>
                        {conversation.other_user_name}
                      </div>
                      <div style={styles.conversationTime}>
                        {conversation.last_message_time
                          ? formatDate(conversation.last_message_time)
                          : ""}
                      </div>
                    </div>
                    <div style={styles.conversationProperty}>
                      {conversation.listing_title}
                    </div>
                    <div style={styles.conversationLastMessage}>
                      {conversation.last_message?.length > 50
                        ? conversation.last_message.substring(0, 50) + "..."
                        : conversation.last_message || "No messages yet"}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div style={styles.unreadBadge}>
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderInfo}>
                  <div style={styles.chatHeaderName}>
                    {selectedConversation.other_user_name}
                  </div>
                  <div style={styles.chatHeaderProperty}>
                    {selectedConversation.listing_title}
                  </div>
                </div>
                <button
                  style={styles.viewPropertyButton}
                  onClick={() =>
                    navigate(`/property/${selectedConversation.listing_id}`)
                  }
                >
                  View Property
                </button>
              </div>

              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div style={styles.emptyMessages}>
                    <div style={styles.emptyMessagesIcon}>💬</div>
                    <div style={styles.emptyMessagesText}>No messages yet</div>
                    <div style={styles.emptyMessagesSubtext}>
                      Start the conversation!
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        ...styles.messageContainer,
                        ...(message.sender_id === getUserId()
                          ? styles.sentMessage
                          : styles.receivedMessage),
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageContent,
                          ...(message.sender_id === getUserId()
                            ? styles.sentMessageContent
                            : styles.receivedMessageContent),
                        }}
                      >
                        <div style={styles.messageText}>{message.message}</div>
                        <div style={styles.messageTime}>
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form style={styles.messageInputContainer} onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.messageInput}
                />
                <button type="submit" style={styles.sendButton}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={styles.noConversationSelected}>
              <div style={styles.noConversationIcon}>💬</div>
              <div style={styles.noConversationText}>
                Select a conversation to start messaging
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "350px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  },
  sidebarTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  conversationsList: {
    flex: 1,
    overflowY: "auto",
  },
  conversationItem: {
    display: "flex",
    padding: "16px 20px",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    position: "relative",
  },
  selectedConversation: {
    backgroundColor: "#eff6ff",
    borderRight: "3px solid #2563eb",
  },
  conversationAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    fontSize: "20px",
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  conversationName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  conversationTime: {
    fontSize: "12px",
    color: "#6b7280",
  },
  conversationProperty: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  conversationLastMessage: {
    fontSize: "14px",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  unreadBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "white",
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px",
  },
  chatHeaderProperty: {
    fontSize: "14px",
    color: "#6b7280",
  },
  viewPropertyButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageContainer: {
    display: "flex",
    marginBottom: "8px",
  },
  sentMessage: {
    justifyContent: "flex-end",
  },
  receivedMessage: {
    justifyContent: "flex-start",
  },
  messageContent: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: "18px",
    position: "relative",
  },
  sentMessageContent: {
    backgroundColor: "#2563eb",
    color: "white",
    marginLeft: "auto",
  },
  receivedMessageContent: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    marginRight: "auto",
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.4",
    marginBottom: "4px",
  },
  messageTime: {
    fontSize: "11px",
    opacity: 0.7,
    textAlign: "right",
  },
  messageInputContainer: {
    display: "flex",
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "white",
    gap: "12px",
  },
  messageInput: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "24px",
    fontSize: "14px",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "14px",
    color: "#6b7280",
  },
  noConversationSelected: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
  },
  noConversationIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  noConversationText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
  },
  emptyMessages: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
  },
  emptyMessagesIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyMessagesText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  emptyMessagesSubtext: {
    fontSize: "14px",
    color: "#6b7280",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loadingText: {
    fontSize: "18px",
    color: "#6b7280",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  errorText: {
    fontSize: "18px",
    color: "#dc2626",
  },
};

export default ViewMessages;
