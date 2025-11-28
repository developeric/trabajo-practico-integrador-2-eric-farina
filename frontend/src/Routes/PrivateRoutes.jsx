import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { Outlet, Navigate } from "react-router-dom";
export const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("Error de fetch");
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
    <Outlet />
  ) : (
    <Navigate to="/home" />
  );
};
