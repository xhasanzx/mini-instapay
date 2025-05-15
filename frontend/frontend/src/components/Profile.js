import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:8000/user/profile?username=${user.username}&password=${user.password}`
        );
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setEditBalance(data.balance);
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (user && user.username) fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:8000/user/update/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, balance: editBalance }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setProfile((prev) => ({ ...prev, balance: editBalance }));
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          borderRadius: 16,
          padding: "2.5rem 2rem",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#222",
            fontWeight: 700,
          }}
        >
          User Profile
        </h2>
        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : profile ? (
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.1rem", color: "#888" }}>
                Username
              </span>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#007bff",
                  marginBottom: 8,
                }}
              >
                {profile.username}
              </div>
            </div>
            <form
              onSubmit={handleUpdate}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label
                style={{
                  fontWeight: 500,
                  color: "#555",
                  marginBottom: 4,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Balance
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  style={{
                    marginLeft: "0.5rem",
                    width: "120px",
                    padding: "0.5rem",
                    borderRadius: 6,
                    border: "1.5px solid #ddd",
                    fontSize: "1.1rem",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                  required
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  EGP
                </span>
              </label>
              <button
                type="submit"
                disabled={updating}
                style={{
                  marginTop: "0.5rem",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.7rem 2rem",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: updating ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {updating ? "Updating..." : "Update Balance"}
              </button>
            </form>
            {success && (
              <div
                className="success"
                style={{ textAlign: "center", marginTop: 12 }}
              >
                {success}
              </div>
            )}
            {error && (
              <div
                className="error"
                style={{ textAlign: "center", marginTop: 12 }}
              >
                {error}
              </div>
            )}
          </div>
        ) : null}
        <Link
          to="/"
          className="auth-link"
          style={{
            display: "block",
            marginTop: "2.5rem",
            textAlign: "center",
            color: "#007bff",
            textDecoration: "none",
            fontWeight: 600,
            background: "#f0f4ff",
            borderRadius: 6,
            padding: "0.7rem 0",
            width: "100%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Profile;
