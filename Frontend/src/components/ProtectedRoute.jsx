import { getUserProfile } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: user, isLoading } = useQuery({
    queryFn: () => getUserProfile,
    queryKey: ["profile"],
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
