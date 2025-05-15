import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SendMoneyForm from "./SendMoneyForm";
import RequestMoneyForm from "./RequestMoneyForm";

const Home = () => {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      setError("");
      try {
        if (user && user.username && user.password) {
          const response = await fetch(
            `http://localhost:8000/user/profile?username=${user.username}&password=${user.password}/`
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

  // Callback to update balance after sending/requesting money
  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <h1>Mini InstaPay</h1>
        <div className="user-section">
          <span>Welcome, {user?.username}!</span>
          <Link to="/dashboard" className="auth-link">
            Dashboard
          </Link>
          <Link to="/profile" className="auth-link">
            Profile
          </Link>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="home-content">
        <h2>Welcome to Mini InstaPay</h2>
        {loading ? (
          <p>Loading balance...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <p>
            <strong>Balance:</strong> {balance} EGP
          </p>
        )}
        <SendMoneyForm onBalanceUpdate={handleBalanceUpdate} />
        <RequestMoneyForm onBalanceUpdate={handleBalanceUpdate} />
      </div>
    </div>
  );
};

export default Home;
