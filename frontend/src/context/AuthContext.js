import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error managing user in localStorage:", error);
    }
  }, [user]);

  const login = (userObj) => {
    setUser(userObj);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userObj) => {
    setUser(userObj);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
