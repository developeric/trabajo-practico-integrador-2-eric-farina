import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Loading } from "../components/Loading";

export default function PublicRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (response.ok) {
        // si la respuesta es ok es porque está autenticado
        isAuthenticated(true);
      } else {
        //   si no, no está autenticado
        setIsAuthenticated(false);
      }
    } catch (error) {
      // console.log("Error de fetch");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAut();
  }, []);
  return isLoading ? (
    <Loading />
  ) : isAuthenticated ? (
    <Navigate to="/home" />
  ) : (
    <Outlet />
  );
}
