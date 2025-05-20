import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SendMoneyForm from "./SendMoneyForm";
import RequestMoneyForm from "./RequestMoneyForm";
import Navbar from "./Navbar";
import "./Home.css";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      setError("");
      try {
        if (user && user.username && user.password) {
          const response = await fetch(
            `http://localhost:8000/user/profile?username=${user.username}&password=${user.password}`
          );
          const data = await response.json();
          if (response.ok) {
            setBalance(data.balance);
          } else {
            setError(data.error || "Failed to fetch balance");
          }
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBalance();
  }, [user]);

  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <div className="home-container">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

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
              <SendMoneyForm onBalanceUpdate={handleBalanceUpdate} />
            </div>
            <div className="form-section">
              <h3>Request Money</h3>
              <RequestMoneyForm onBalanceUpdate={handleBalanceUpdate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
