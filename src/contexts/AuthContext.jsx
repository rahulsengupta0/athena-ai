import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile to check role
  const fetchUserProfile = useCallback(async () => {
    try {
      const profileData = await api.getProfile();
      setUser(profileData);
      setIsAdmin(profileData?.role === 'admin');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = useCallback(async (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  }, []);

  if (isAuthenticated === null || isLoading) {
    // You can show a loading indicator here while the token check is in progress
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
