import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SendMoneyForm = ({ onBalanceUpdate }) => {
  const { user } = useAuth();
  const [receiverName, setReceiverName] = useState("");
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
      const response = await fetch("http://localhost:8001/transaction/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          amount,
          receiverName,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || "Transaction successful!");
        setAmount("");
        setReceiverName("");
        // Update balance for the sender
        if (data.updated_balance) {
          await fetch("http://localhost:8001/transaction/addBalance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user.username,
              balance: data.updated_balance,
            }),
          });
          if (onBalanceUpdate) {
            onBalanceUpdate(data.updated_balance);
          }
        }
      } else {
        setError(data.error || "Transaction failed.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ marginTop: "2rem" }}>
      <h2>Send Money</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Receiver Username</label>
          <input
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
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
        {success && (
          <div
            className="success"
            style={{ color: "green", marginBottom: "1rem" }}
          >
            {success}
          </div>
        )}
        {error && (
          <div className="error" style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#007bff",
            cursor: loading ? "not-allowed" : "pointer",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send Money"}
        </button>
      </form>
    </div>
  );
};

export default SendMoneyForm;
