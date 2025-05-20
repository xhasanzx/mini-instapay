import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = ({ username }) => {
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/notifications/all-notifications/",
        {
          params: { username },
        }
      );
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notifications");
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8002/notifications/all-requests/",
        {
          params: { username },
        }
      );
      setRequests(response.data.requests);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchRequests();
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [username]);

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:8002/notifications/approve-request/", {
        request_id: requestId,
      });
      // Refresh requests after approval
      fetchRequests();
    } catch (err) {
      setError("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:8002/notifications/reject-request/", {
        request_id: requestId,
      });
      // Refresh requests after rejection
      fetchRequests();
    } catch (err) {
      setError("Failed to reject request");
    }
  };

  if (loading) return <div className="notifications-loading">Loading...</div>;
  if (error) return <div className="notifications-error">{error}</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-section">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="requests-section">
        <h2>Money Requests</h2>
        {requests.length === 0 ? (
          <p className="no-requests">No pending requests</p>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <p>
                    {request.requester} requested ${request.amount}
                  </p>
                  <span className="request-time">
                    {new Date(request.created_at).toLocaleString()}
                  </span>
                </div>
                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
                {request.status !== "pending" && (
                  <span className={`request-status ${request.status}`}>
                    {request.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
