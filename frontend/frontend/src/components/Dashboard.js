import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState({
    totalSent: 0,
    totalReceived: 0,
    count: 0,
    highest: 0,
    lowest: 0,
  });
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8001/transaction/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.username }),
        });
        const data = await response.json();
        if (response.ok) {
          // Combine sent and received transactions
          const allTransactions = [
            ...(data.sent_transactions || []),
            ...(data.received_transactions || []),
          ];
          // Sort by timestamp if available
          allTransactions.sort((a, b) => {
            const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
            const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
            return dateB - dateA;
          });
          setLogs(allTransactions);
        } else {
          setError(data.error || "Failed to fetch transaction logs");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (user && user.username) fetchLogs();
  }, [user]);

  useEffect(() => {
    if (logs && logs.length > 0) {
      let totalSent = 0;
      let totalReceived = 0;
      let highest = Number.MIN_VALUE;
      let lowest = Number.MAX_VALUE;
      logs.forEach((log) => {
        const amt = parseFloat(log.amount);
        if (log.sender === user.username) {
          totalSent += amt;
        }
        if (log.receiver === user.username) {
          totalReceived += amt;
        }
        if (amt > highest) highest = amt;
        if (amt < lowest) lowest = amt;
      });
      setReport({
        totalSent,
        totalReceived,
        count: logs.length,
        highest: highest === Number.MIN_VALUE ? 0 : highest,
        lowest: lowest === Number.MAX_VALUE ? 0 : lowest,
      });
    } else {
      setReport({
        totalSent: 0,
        totalReceived: 0,
        count: 0,
        highest: 0,
        lowest: 0,
      });
    }
  }, [logs, user]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        className="dashboard-sidebar"
        style={{
          width: "220px",
          background: "#222",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1rem",
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: "2rem" }}>Dashboard</h2>
        <button
          className={activeTab === "transactions" ? "active" : ""}
          style={{
            background:
              activeTab === "transactions" ? "#007bff" : "transparent",
            color: "#fff",
            border: "none",
            padding: "1rem",
            textAlign: "left",
            cursor: "pointer",
            marginBottom: "1rem",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          style={{
            background: activeTab === "reports" ? "#007bff" : "transparent",
            color: "#fff",
            border: "none",
            padding: "1rem",
            textAlign: "left",
            cursor: "pointer",
            marginBottom: "1rem",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            padding: "1rem",
            borderRadius: "4px",
            background: "transparent",
            fontWeight: "bold",
          }}
        >
          Home
        </Link>
      </nav>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2 style={{ marginBottom: "2rem" }}>Transaction Dashboard</h2>
        {activeTab === "reports" && (
          <section style={{ marginBottom: "2rem" }}>
            <h3>Reports</h3>
            <ul style={{ textAlign: "left" }}>
              <li>
                <strong>Total Sent:</strong> {report.totalSent} EGP
              </li>
              <li>
                <strong>Total Received:</strong> {report.totalReceived} EGP
              </li>
              <li>
                <strong>Number of Transactions:</strong> {report.count}
              </li>
              <li>
                <strong>Highest Transaction:</strong> {report.highest} EGP
              </li>
              <li>
                <strong>Lowest Transaction:</strong> {report.lowest} EGP
              </li>
            </ul>
          </section>
        )}
        {activeTab === "transactions" && (
          <section>
            <h3>Transaction Logs</h3>
            {loading ? (
              <p>Loading logs...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : logs && logs.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={idx}>
                      <td>
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>{log.sender}</td>
                      <td>{log.receiver}</td>
                      <td>{parseFloat(log.amount).toFixed(2)} EGP</td>
                      <td>
                        {log.sender === user.username
                          ? "Sent"
                          : log.receiver === user.username
                          ? "Received"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions found.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
