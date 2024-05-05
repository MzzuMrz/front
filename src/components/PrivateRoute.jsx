import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../api"; // Asegúrate de que tienes una API configurada para hacer solicitudes HTTP.

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Agregamos un estado para el manejo de carga.

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get("/users/verifyUser");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
