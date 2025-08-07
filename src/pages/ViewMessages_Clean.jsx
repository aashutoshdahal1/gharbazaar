import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);

  const API_BASE_URL = url + "api";

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Current user:", user);
        return user.id;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    console.log("No user data found in localStorage");
    return null;
  };

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

  const fetchMessages = useCallback(
    async (listingId, otherUserId, isPolling = false) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        if (!isPolling) {
          console.log(
            `Fetching messages for listing ${listingId} with user ${otherUserId}`
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/messages/conversation/${listingId}/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!isPolling) {
          console.log("API Response:", data);
        }

        if (response.ok && data.success) {
          // Only update if messages have changed (for polling)
          if (isPolling) {
            setMessages((prevMessages) => {
              // Compare message count and last message ID for better performance
              const newMessages = data.data;
              const hasNewMessages =
                newMessages.length > prevMessages.length ||
                (newMessages.length > 0 &&
                  prevMessages.length > 0 &&
                  newMessages[newMessages.length - 1].id !==
                    prevMessages[prevMessages.length - 1].id);

              if (hasNewMessages) {
                // Only scroll if user is near the bottom of the chat
                setTimeout(() => {
                  const messageContainer = document.querySelector(
                    '[data-messages-container="true"]'
                  );
                  if (messageContainer) {
                    const isNearBottom =
                      messageContainer.scrollTop +
                        messageContainer.clientHeight >=
                      messageContainer.scrollHeight - 50;
                    if (isNearBottom) {
                      scrollToBottom();
                    }
                  }
                }, 100);
                return newMessages;
              }
              return prevMessages; // No change
            });
          } else {
            setMessages(data.data);
            // Scroll to bottom after updating messages (initial load)
            setTimeout(() => scrollToBottom(), 100);
          }
        } else {
          console.error("Failed to fetch messages:", data.message);
          // If it's a 403, show a more user-friendly error
          if (response.status === 403) {
            console.error(
              "Access denied - you may not have permission to view this conversation"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [API_BASE_URL]
  );

  useEffect(() => {
    fetchConversations();

    // Start polling for new conversations every 10 seconds
    const conversationInterval = setInterval(() => {
      if (!isPolling) {
        setIsPolling(true);
        fetchConversations().finally(() => setIsPolling(false));
      }
    }, 10000);

    return () => clearInterval(conversationInterval);
  }, [fetchConversations, isPolling]);

  useEffect(() => {
    if (selectedConversation) {
      console.log("Selected conversation:", selectedConversation);
      console.log("Current user ID:", getUserId());
      // Reset the initial load flag when switching conversations
      selectedConversation.hasInitialLoad = false;
      fetchMessages(
        selectedConversation.listing_id,
        selectedConversation.other_user_id,
        false
      );

      // Start polling for new messages every 5 seconds
      const messageInterval = setInterval(() => {
        fetchMessages(
          selectedConversation.listing_id,
          selectedConversation.other_user_id,
          true
        );
      }, 5000);

      return () => clearInterval(messageInterval);
    }
  }, [selectedConversation, fetchMessages]);

  // Only scroll on initial conversation load or when sending a message
  useEffect(() => {
    if (messages.length > 0 && selectedConversation) {
      // Only auto-scroll on initial load (when there's no previous message count)
      if (!selectedConversation.hasInitialLoad) {
        scrollToBottom();
        selectedConversation.hasInitialLoad = true;
      }
    }
  }, [messages, selectedConversation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any intervals when component unmounts
      setMessages([]);
      setConversations([]);
      setSelectedConversation(null);
    };
  }, []);

  // Auto-select conversation based on URL parameters
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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

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
        // Add the new message to the messages list
        setMessages((prev) => [...prev, data.data]);
        // Update the conversation's last message
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
        // Always scroll to bottom after sending a message
        setTimeout(() => scrollToBottom(), 50);
      } else {
        console.error("Failed to send message:", data.message);
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
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
          showDashboardButton={false}
          showBackButton={true}
          backButtonText="← Back to Dashboard"
          backButtonAction={() => navigate("/dashboard")}
          showHomeAndProperties={false}
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
          showDashboardButton={false}
          showBackButton={true}
          backButtonText="← Back to Dashboard"
          backButtonAction={() => navigate("/dashboard")}
          showHomeAndProperties={false}
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
        showDashboardButton={false}
        showBackButton={true}
        backButtonText="← Back to Dashboard"
        backButtonAction={() => navigate("/dashboard")}
        showHomeAndProperties={false}
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
              <div
                style={styles.messagesContainer}
                data-messages-container="true"
              >
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
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
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
    scrollBehavior: "smooth",
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
