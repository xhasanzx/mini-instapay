import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const TransactionLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        if (user && user.username) {
          const response = await fetch(
            `http://localhost:8001/transaction/logs?username=${user.username}`
          );
          const data = await response.json();
          if (response.ok) {
            setLogs(data.logs || data); // Adjust this line based on your backend response structure
          } else {
            setError(data.error || "Failed to fetch transaction logs");
          }
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  return (
    <div className="auth-container" style={{ marginTop: "2rem" }}>
      <h2>Transaction Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : logs && logs.length > 0 ? (
        <ul style={{ textAlign: "left" }}>
          {logs.map((log, idx) => (
            <li key={idx}>
              <strong>{log.timestamp || log.date || ""}</strong>: {log.sender}{" "}
              sent {log.amount} EGP to {log.receiver}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionLogs;
