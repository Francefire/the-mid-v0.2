import { useAuth } from "@/context/authContext";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export const LoggedRoutes = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};
