import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

const Notifications = ({ onNewNotification }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);

  const fetchNotifications = async () => {
    if (!user?.username) return;

    try {
      console.log("Fetching notifications for user:", user.username);
      const response = await fetch(
        `http://localhost:8003/notifications/all-notifications/?username=${user.username}`
      );
      const data = await response.json();
      console.log("Received notifications:", data);

      if (response.ok) {
        const newNotifications = data.notifications;
        setNotifications(newNotifications);

        // Check for new notifications
        if (newNotifications.length > 0) {
          const latestNotification = newNotifications[0];
          console.log("Latest notification:", latestNotification);
          console.log("Last notification ID:", lastNotificationId);

          if (lastNotificationId === null) {
            console.log("Setting initial notification ID");
            setLastNotificationId(latestNotification.id);
          } else if (latestNotification.id > lastNotificationId) {
            console.log("New notification found, showing popup");
            setLastNotificationId(latestNotification.id);
            onNewNotification(latestNotification.message);
          }
        }
      } else {
        console.error("Failed to fetch notifications:", data.error);
        setError(data.error || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Notifications component mounted");
    fetchNotifications();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, lastNotificationId]);

  if (loading)
    return (
      <div className="notifications-loading">Loading notifications...</div>
    );
  if (error) return <div className="notifications-error">{error}</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.is_read ? "read" : "unread"
              }`}
            >
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
