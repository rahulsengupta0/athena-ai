import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token"); // IMPORTANT: double check token

  // Fix browser forward/backward caching issue (BFCache)
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) {
        window.location.reload(); // force full auth check
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // still checking initial auth state
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // if no token or not authenticated → block
  if (!token || !isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;
