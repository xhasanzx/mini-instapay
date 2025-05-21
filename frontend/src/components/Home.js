import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SendMoneyForm from "./SendMoneyForm";
import RequestMoneyForm from "./RequestMoneyForm";
import Notifications from "./Notifications";
import PopupNotification from "./PopupNotification";
import Navbar from "./Navbar";
import "./Home.css";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const showNotification = (message) => {
    console.log("showNotification called with message:", message);
    // Force a console log  ensure it's not a console filtering issue
    alert("Notification triggered: " + message);
    setPopupNotification(message);
  };

  const hideNotification = () => {
    console.log("hideNotification called");
    setPopupNotification(null);
  };

  // Debug log for popupNotification changes
  useEffect(() => {
    console.log("popupNotification state changed:", popupNotification);
  }, [popupNotification]);

  useEffect(() => {
    console.log("Home component mounted");
    const fetchBalance = async () => {
      setLoading(true);
      setError("");
      try {
        if (user && user.username && user.password) {
          console.log("Fetching balance for user:", user.username);
          const response = await fetch(
            `http://localhost:8000/user/profile?username=${user.username}&password=${user.password}`
          );
          const data = await response.json();
          console.log("Balance response:", data);
          if (response.ok) {
            setBalance(data.balance);
          } else {
            setError(data.error || "Failed to fetch balance");
          }
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBalance();
  }, [user]);

  const handleBalanceUpdate = (newBalance) => {
    console.log("handleBalanceUpdate called with:", newBalance);
    setBalance(newBalance);
  };

  // Debug log for render
  console.log(
    "Home component rendering with popupNotification:",
    popupNotification
  );

  return (
    <div className="home-container">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Debug log for popup notification render */}
      {console.log("About to render PopupNotification:", popupNotification)}
      {popupNotification && (
        <PopupNotification
          message={popupNotification}
          onClose={hideNotification}
        />
      )}

      {!isAuthenticated ? (
        <>
          <div className="hero-section">
            <h1>Welcome to InstaPay</h1>
            <p>Fast, secure, and convenient money transfers</p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-button login">
                Login
              </Link>
              <Link to="/register" className="cta-button register">
                Register
              </Link>
            </div>
          </div>

          <div className="features-section">
            <h2>Why Choose InstaPay?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Fast Transfers</h3>
                <p>Send money instantly to anyone, anywhere</p>
              </div>
              <div className="feature-card">
                <h3>Secure</h3>
                <p>Your transactions are protected with advanced security</p>
              </div>
              <div className="feature-card">
                <h3>Easy to Use</h3>
                <p>Simple and intuitive interface for all users</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="home-content">
          <div className="balance-section">
            <h2>Welcome to InstaPay</h2>
            {loading ? (
              <p>Loading balance...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div className="balance-card">
                <h3>Your Balance</h3>
                <p className="balance-amount">{balance} EGP</p>
              </div>
            )}
          </div>

          <div className="transfer-forms">
            <div className="form-section">
              <h3>Send Money</h3>
              <SendMoneyForm
                onBalanceUpdate={handleBalanceUpdate}
                onTransactionSuccess={(message) => {
                  console.log(
                    "Transaction success callback received:",
                    message
                  );
                  showNotification(message);
                }}
              />
            </div>
            <div className="form-section">
              <h3>Request Money</h3>
              <RequestMoneyForm
                onBalanceUpdate={handleBalanceUpdate}
                onRequestSuccess={(message) => {
                  console.log("Request success callback received:", message);
                  showNotification(message);
                }}
              />
            </div>
          </div>

          <div className="notifications-section">
            <Notifications
              onNewNotification={(message) => {
                console.log("New notification callback received:", message);
                showNotification(message);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
