import React, { useEffect } from "react";
import "./PopupNotification.css";

const PopupNotification = ({ message, onClose }) => {
  console.log("PopupNotification rendered with message:", message);

  useEffect(() => {
    console.log("Setting up auto-close timer");
    const timer = setTimeout(() => {
      console.log("Auto-closing notification");
      onClose();
    }, 5000);

    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="popup-notification">
      <div className="popup-content">
        <p>{message}</p>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default PopupNotification;
