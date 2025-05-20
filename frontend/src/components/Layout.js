import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./Dashboard.css";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <aside className={`dashboard-sidebar ${isMenuOpen ? "open" : ""}`}>
        <h2>Dashboard</h2>
        <Link
          to="/dashboard"
          className={`sidebar-button${isActive("/dashboard") ? " active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Transactions
        </Link>
        <Link
          to="/reports"
          className={`sidebar-button${isActive("/reports") ? " active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Reports
        </Link>
        <Link
          to="/notifications"
          className={`sidebar-button${
            isActive("/notifications") ? " active" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          Notifications
        </Link>
        <Link
          to="/"
          className={`sidebar-link${isActive("/") ? " active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
      </aside>
      <main className={`dashboard-content ${isMenuOpen ? "shifted" : ""}`}>
        <Outlet />
      </main>
      <div
        className={`overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default Layout;
