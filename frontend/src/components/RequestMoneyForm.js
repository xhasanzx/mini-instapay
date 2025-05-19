import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const RequestMoneyForm = ({ onBalanceUpdate }) => {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await fetch(
        "http://localhost:8001/transaction/receive",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username, // The receiver (current user)
            password: user.password,
            amount,
            senderName, // The sender (who will pay)
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || "Request successful!");
        setAmount("");
        setSenderName("");
        if (data.updated_balance && onBalanceUpdate) {
          onBalanceUpdate(data.updated_balance);
        }
      } else {
        setError(data.error || "Request failed.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ marginTop: "2rem" }}>
      <h2>Request Money</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sender Username</label>
          <input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        {success && <div className="success">{success}</div>}
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Requesting..." : "Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestMoneyForm;
