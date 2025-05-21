import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import Notifications from "./Notifications";
import Navbar from "./Navbar";
import "./Dashboard.css";
import config from "../config";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
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
  const [sentAnalysis, setSentAnalysis] = useState({
    total_sent: 0,
    receiver_frequencies: {},
  });
  const [receivedAnalysis, setReceivedAnalysis] = useState({
    total_received: 0,
    sender_frequencies: {},
  });
  const [activeTab, setActiveTab] = useState("transactions");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("Dashboard rendered, isMenuOpen:", isMenuOpen);

  const toggleMenu = () => {
    console.log("toggleMenu called, current isMenuOpen:", isMenuOpen);
    setIsMenuOpen((prevState) => {
      const newState = !prevState;
      console.log("Setting isMenuOpen to:", newState);
      return newState;
    });
  };

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:8001/transaction/logs/?username=${user.username}`
        );
        const data = await response.json();
        if (response.ok) {
          const allTransactions = [
            ...(data.sent_transactions || []),
            ...(data.received_transactions || []),
          ];
          allTransactions.sort((a, b) => {
            const dateA = a.time ? new Date(a.time) : new Date(0);
            const dateB = b.time ? new Date(b.time) : new Date(0);
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

    const fetchReports = async () => {
      try {
        // Fetch sent analysis
        const sentResponse = await fetch(
          `${config.REPORTING_URL}/reports/sent/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ username: user.username }),
            credentials: "include",
          }
        );

        if (!sentResponse.ok) {
          throw new Error(`Sent analysis failed: ${sentResponse.statusText}`);
        }

        const sentData = await sentResponse.json();
        setSentAnalysis(sentData);

        // Fetch received analysis
        const receivedResponse = await fetch(
          `${config.REPORTING_URL}/reports/received/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ username: user.username }),
            credentials: "include",
          }
        );

        if (!receivedResponse.ok) {
          throw new Error(
            `Received analysis failed: ${receivedResponse.statusText}`
          );
        }

        const receivedData = await receivedResponse.json();
        setReceivedAnalysis(receivedData);

        // Update report with the new data
        setReport((prevReport) => ({
          ...prevReport,
          totalSent: sentData.total_sent || 0,
          totalReceived: receivedData.total_received || 0,
        }));
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to fetch reports");
      }
    };

    fetchLogs();
    fetchReports();
  }, [user]);

  useEffect(() => {
    if (!logs || !user) return;

    if (logs.length > 0) {
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
        totalSent: sentAnalysis.total_sent,
        totalReceived: receivedAnalysis.total_received,
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
  }, [logs, user, sentAnalysis.total_sent, receivedAnalysis.total_received]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If user is not loaded yet, show loading state
  if (!user) {
    return <div className="loading-message">Loading...</div>;
  }

  console.log("Rendering Dashboard with isMenuOpen:", isMenuOpen);

  return (
    <div className="dashboard-container">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <aside className={`dashboard-sidebar ${isMenuOpen ? "open" : ""}`}>
        <h2>Dashboard</h2>
        <button
          className={`sidebar-button ${
            activeTab === "transactions" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("transactions");
            setIsMenuOpen(false);
          }}
        >
          Transactions
        </button>
        <button
          className={`sidebar-button ${
            activeTab === "reports" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("reports");
            setIsMenuOpen(false);
          }}
        >
          Reports
        </button>
        <button
          className={`sidebar-button ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("notifications");
            setIsMenuOpen(false);
          }}
        >
          Notifications
        </button>
        <Link
          to="/"
          className="sidebar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
      </aside>

      <main className={`dashboard-content ${isMenuOpen ? "shifted" : ""}`}>
        <h2 className="section-title">Transaction Dashboard</h2>

        {activeTab === "notifications" && (
          <section>
            <h3 className="section-title">Notifications</h3>
            <Notifications username={user.username} />
          </section>
        )}

        {activeTab === "reports" && (
          <section>
            <h3 className="section-title">Transaction Reports</h3>

            <div className="reports-grid">
              <div className="report-card sent">
                <h4 className="report-label">Total Sent</h4>
                <p className="report-value">
                  {parseFloat(sentAnalysis.total_sent || 0).toFixed(2)} EGP
                </p>
              </div>

              <div className="report-card received">
                <h4 className="report-label">Total Received</h4>
                <p className="report-value">
                  {parseFloat(receivedAnalysis.total_received || 0).toFixed(2)}{" "}
                  EGP
                </p>
              </div>

              <div className="report-card transactions">
                <h4 className="report-label">Number of Transactions</h4>
                <p className="report-value">{report.count}</p>
              </div>
            </div>

            <div className="analysis-grid">
              <div className="analysis-card">
                <h4 className="analysis-title">Sent Transactions Analysis</h4>
                <div>
                  <h5 className="analysis-subtitle">Top Recipients</h5>
                  {Object.entries(sentAnalysis.receiver_frequencies || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([receiver, count]) => (
                      <div key={receiver} className="transaction-item">
                        <span className="transaction-name">{receiver}</span>
                        <span className="transaction-count sent">
                          {count} transactions
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="analysis-card">
                <h4 className="analysis-title">
                  Received Transactions Analysis
                </h4>
                <div>
                  <h5 className="analysis-subtitle">Top Senders</h5>
                  {Object.entries(receivedAnalysis.sender_frequencies || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([sender, count]) => (
                      <div key={sender} className="transaction-item">
                        <span className="transaction-name">{sender}</span>
                        <span className="transaction-count received">
                          {count} transactions
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "transactions" && (
          <section>
            <h3 className="section-title">Transaction History</h3>
            {loading ? (
              <p className="loading-message">Loading transactions...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : logs && logs.length > 0 ? (
              <div className="transactions-container">
                <table className="transactions-table">
                  <thead className="table-header">
                    <tr>
                      <th>Date</th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th className="amount">Amount</th>
                      <th className="type">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr key={idx} className="table-row">
                        <td className="table-cell date">
                          {log.time
                            ? new Date(log.time).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="table-cell">{log.sender}</td>
                        <td className="table-cell">{log.receiver}</td>
                        <td className="table-cell amount">
                          {parseFloat(log.amount).toFixed(2)} EGP
                        </td>
                        <td className="table-cell type">
                          <span
                            className={`transaction-badge ${
                              log.sender === user.username ? "sent" : "received"
                            }`}
                          >
                            {log.sender === user.username ? "Sent" : "Received"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-transactions">No transactions found.</p>
            )}
          </section>
        )}
      </main>

      <div
        className={`overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={() => {
          console.log("Overlay clicked, closing menu");
          setIsMenuOpen(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
