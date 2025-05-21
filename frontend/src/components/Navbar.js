import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import Dashboard from "./Dashboard";

const Navbar = ({ isMenuOpen = false, toggleMenu = () => {} }) => {
  const { user, logout } = useAuth();

  const handleMenuClick = () => {
    if (typeof toggleMenu === "function") {
      toggleMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle"
          onClick={handleMenuClick}
          aria-label="Toggle menu"
        >
          <span className={`menu-icon ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <Link to="/" className="navbar-brand">
          InstaPay
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.username}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
